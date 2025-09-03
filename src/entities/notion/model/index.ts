import { Client } from "@notionhq/client";
import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAPI } from "notion-client";
import type { GuestbookFormData } from "@/entities/guestbooks/model/type";
import { Post } from "@/entities/posts/model";
import type { TagDatabaseResponse } from "@/entities/posts/model/type";
import { nextServerCache } from "@/shared/lib/cache";

const notionToken = process.env.NOTION_KEY;
const notionAboutPageID = process.env.NOTION_ABOUT_PAGE_ID;
const notionPostDatabaseId = process.env.NOTION_POST_DATABASE_ID;
const notionGuestbookDatabaseId = process.env.NOTION_GUESTBOOK_DATABASE_ID;
const notionUser = process.env.NOTION_USER_ID;
const notionTokenV2 = process.env.NOTION_TOKEN_V2;

const notion = new Client({
  auth: notionToken,
});

const notionApi = new NotionAPI({
  activeUser: notionUser,
  authToken: notionTokenV2,
});

/**
 * 블로그 포스트 공개 목록 가져오기
 *
 * @returns
 */
async function _getNotionPosts() {
  if (!notionPostDatabaseId) {
    throw Error("notionPostDatabaseId is not settled.");
  }
  const response = await notion.databases.query({
    database_id: notionPostDatabaseId,
    filter: {
      property: "상태",
      status: {
        equals: "공개",
      },
    },
    sorts: [
      {
        property: "날짜",
        direction: "descending",
      },
    ],
  });

  return response.results as DatabaseObjectResponse[];
}

/**`
 * 블로그 포스트 메타데이터 가져오기
 *
 * @param id 페이지 아이디
 * @returns
 */
async function _getNotionPostMetadata(id: string) {
  const pageResponse = await notion.pages.retrieve({
    page_id: id,
  });
  const contentResponse = await notion.blocks.children.list({
    block_id: id,
  });

  /* @ts-expect-error Notion Type Error */
  const title = pageResponse.properties.제목.title[0].plain_text;

  /* @ts-expect-error Notion Type Error */
  const tags = pageResponse.properties.Tags.multi_select.map(
    /* @ts-expect-error Notion Type Error */
    (tag) => tag.name,
  );

  const content =
    contentResponse.results
      /* @ts-expect-error Notion Type Error */
      .filter((block) => block.type === "paragraph")
      /* @ts-expect-error Notion Type Error */
      .find((block) => block.paragraph.rich_text.length > 0)
      /* @ts-expect-error Notion Type Error */
      ?.paragraph.rich_text.map((text) => text.plain_text)
      .join("")
      .substr(0, 77) || "";

  return {
    title,
    content,
    tags,
  };
}

/**
 * 블로그 포스트 본문 내용(텍스트) 가져오기 - 요약용
 *
 * @param id string 페이지 아이디
 * @returns
 */
async function _getNotionPostContentForSummary(id: string) {
  const pageResponse = await notion.pages.retrieve({
    page_id: id,
  });
  const contentResponse = await notion.blocks.children.list({
    block_id: id,
  });

  /* @ts-expect-error Notion Type Error */
  const title = pageResponse.properties.제목.title[0].plain_text;

  const content = contentResponse.results
    /* @ts-expect-error Notion Type Error */
    .filter((block) => block.type === "paragraph")
    .map((block) =>
      /* @ts-expect-error Notion Type Error */
      block.paragraph.rich_text
        /* @ts-expect-error Notion Type Error */
        .map((text) => text.plain_text)
        .join(""),
    )
    .join("");

  /* @ts-expect-error Notion Type Error */
  const summary = pageResponse.properties.summary.rich_text
    /* @ts-expect-error Notion Type Error */
    .map((text) => text.plain_text)
    .join("");

  const isSummarized = summary.length > 0;

  return { title, content, isSummarized };
}

/**
 * 블로그 포스트 데이터베이스 태그 정보 가져오기
 *
 * @returns
 */
async function _getNotionPostDatabaseTags() {
  if (!notionPostDatabaseId) {
    throw Error("notionPostDatabaseId is not settled.");
  }
  const response = await notion.databases.retrieve({
    database_id: notionPostDatabaseId,
  });

  /* @ts-expect-error Notion Type Error */
  const tags = response.properties.Tags.multi_select.options;

  return tags as TagDatabaseResponse[];
}

/**
 * 노션 페이지 렌더링 데이터 가져오기
 *
 * @param id 페이지 아이디
 * @returns
 */
async function _getNotionPage(id: string) {
  const response = await notionApi.getPage(id);

  return response;
}

/**
 * 노션 페이지 렌더링 데이터 가져오기
 *
 * @param id 페이지 아이디
 * @returns
 */
async function _getNotionAboutPage() {
  if (!notionAboutPageID) {
    throw Error("notionAboutPageID is not settled.");
  }
  const response = await notionApi.getPage(notionAboutPageID);

  return response;
}

/**
 * 방명록 작성하기
 *
 * @param name 작성자 이름
 * @param content 방명록 내용
 * @param status 방명록 공개 여부
 */
async function _postNotionGuestbook({
  name,
  content,
  isPrivate,
}: GuestbookFormData) {
  if (!notionGuestbookDatabaseId) {
    throw Error("notionGuestbookDatabaseId is not settled.");
  }
  const response = await notion.pages.create({
    parent: {
      database_id: notionGuestbookDatabaseId,
    },
    properties: {
      작성자: {
        title: [
          {
            text: {
              content: `${name} 님의 방명록`,
            },
          },
        ],
      },
      방명록: {
        rich_text: [
          {
            text: {
              content: content,
            },
          },
        ],
      },
      남긴날짜: {
        date: {
          start: new Date().toISOString(),
        },
      },
      상태: {
        status: {
          name: isPrivate ? "비공개" : "공개",
        },
      },
    },
  });

  const results = {
    id: response.id,
    name: name,
    content: content,
    isPrivate: isPrivate,
  };

  return results;
}

/**
 * 방명록 목록 가져오기
 *
 * @returns
 */
async function _getNotionGuestbooks() {
  if (!notionGuestbookDatabaseId) {
    throw Error("notionGuestbookDatabaseId is not settled.");
  }
  const response = await notion.databases.query({
    database_id: notionGuestbookDatabaseId,
    sorts: [
      {
        property: "남긴날짜",
        direction: "descending",
      },
    ],
  });

  return response.results as DatabaseObjectResponse[];
}

/**
 * 슬러그 맵 가져오기
 *
 * @returns
 */
const _getSlugMap = async () => {
  const posts = (await getNotionPosts()).map(Post.create);

  const slugMap = posts.reduce(
    (acc, { id, slugifiedTitle }) => {
      acc[slugifiedTitle] = id;
      return acc;
    },
    {} as Record<string, string>,
  );

  return slugMap;
};

/**
 * Notion Database 에 컬럼 업데이트 하기
 *
 */
const _patchNotionPostSummary = async (postId: string, aiSummary: string) => {
  const response = await notion.pages.update({
    page_id: postId,
    properties: {
      summary: {
        rich_text: [
          {
            text: {
              content: aiSummary,
            },
          },
        ],
      },
    },
  });

  return response;
};

// 로깅이 적용된 함수들을 export
export const getNotionPosts = nextServerCache(_getNotionPosts, ["posts"]);
export const getNotionPostMetadata = _getNotionPostMetadata;
export const getNotionPostDatabaseTags = nextServerCache(
  _getNotionPostDatabaseTags,
  ["tags"],
);
export const getNotionPage = _getNotionPage;
export const getNotionAboutPage = _getNotionAboutPage;
export const postNotionGuestbook = _postNotionGuestbook;
export const getNotionGuestbooks = _getNotionGuestbooks;
export const getNotionPostContentForSummary = _getNotionPostContentForSummary;
export const getSlugMap = _getSlugMap;
export const patchNotionPostSummary = _patchNotionPostSummary;
