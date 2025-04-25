import type { GuestbookFormData } from "@/entities/guestbooks/model/type";
import type { TagDatabaseResponse } from "@/features/posts/model/type";
import { Client } from "@notionhq/client";
import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAPI } from "notion-client";

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
export async function getNotionPosts() {
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
export async function getNotionPostMetadata(id: string) {
  const pageResponse = await notion.pages.retrieve({
    page_id: id,
  });
  const contentResponse = await notion.blocks.children.list({
    block_id: id,
  });

  /* @ts-expect-error Notion Type Error */
  const title = pageResponse.properties["제목"].title[0].plain_text;

  /* @ts-expect-error Notion Type Error */
  const tags = pageResponse.properties["Tags"].multi_select.map(
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
 * 블로그 포스트 데이터베이스 태그 정보 가져오기
 *
 * @returns
 */
export async function getNotionPostDatabaseTags() {
  if (!notionPostDatabaseId) {
    throw Error("notionPostDatabaseId is not settled.");
  }
  const response = await notion.databases.retrieve({
    database_id: notionPostDatabaseId,
  });

  /* @ts-expect-error Notion Type Error */
  const tags = response.properties["Tags"].multi_select.options;

  return tags as TagDatabaseResponse[];
}

/**
 * 노션 페이지 렌더링 데이터 가져오기
 *
 * @param id 페이지 아이디
 * @returns
 */
export async function getNotionPage(id: string) {
  const response = await notionApi.getPage(id);

  return response;
}

/**
 * 노션 페이지 렌더링 데이터 가져오기
 *
 * @param id 페이지 아이디
 * @returns
 */
export async function getNotionAboutPage() {
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
export async function postNotionGuestbook({
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
export async function getNotionGuestbooks() {
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
