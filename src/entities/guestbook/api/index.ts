import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "@/shared/api";
import type { GuestbookFormData } from "../model/type";

const notionGuestbookDatabaseId = process.env.NOTION_GUESTBOOK_DATABASE_ID;

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

export const postNotionGuestbook = _postNotionGuestbook;
export const getNotionGuestbooks = _getNotionGuestbooks;
