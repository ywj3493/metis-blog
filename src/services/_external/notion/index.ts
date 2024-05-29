import { Tag } from "@/components/LNB";
import { Client } from "@notionhq/client";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAPI } from "notion-client";

export type Guestbook = {
  name: string;
  content: string;
  isPrivate: boolean;
};

const notionToken = process.env.NOTION_KEY;
const notionPostDatabaseId = process.env.NOTION_POST_DATABASE_ID;
const notionGuestbookDatabaseId = process.env.NOTION_GUESTBOOK_DATABASE_ID;
const notionUser = process.env.NOTION_USER_ID;
const notionTokenv2 = process.env.NOTION_TOKEN_V2;

const notion = new Client({
  auth: notionToken,
});

const notionApi = new NotionAPI({
  activeUser: notionUser,
  authToken: notionTokenv2,
});

/**
 * 블로그 포스트 공개 목록 가져오기
 *
 * @returns
 */
export async function getNotionPosts() {
  const response = await notion.databases.query({
    database_id: notionPostDatabaseId as string,
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

/**
 * 블로그 포스트 메타데이터 가져오기
 *
 * @param id 페이지 아이디
 * @returns
 */
export async function getNotionPostMetadata(id: string) {
  const response = await notion.pages.retrieve({
    page_id: id,
  });

  /* @ts-expect-error Notion Type Error */
  const title = response.properties["제목"].title[0].plain_text;

  return {
    title,
  };
}

/**
 * 블로그 포스트 데이터베이스 태그 정보 가져오기
 *
 * @returns
 */
export async function getNotionPostDatabaseTags() {
  const response = await notion.databases.retrieve({
    database_id: notionPostDatabaseId as string,
  });

  /* @ts-expect-error Notion Type Error */
  const tags = response.properties["Tags"].multi_select.options;

  return tags as Tag[];
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
}: Guestbook) {
  const response = await notion.pages.create({
    parent: {
      database_id: notionGuestbookDatabaseId as string,
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
  const response = await notion.databases.query({
    database_id: notionGuestbookDatabaseId as string,
    sorts: [
      {
        property: "남긴날짜",
        direction: "descending",
      },
    ],
  });

  return response.results as DatabaseObjectResponse[];
}
