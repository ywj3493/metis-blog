import { Tag } from "@/components/LNB";
import { Client } from "@notionhq/client";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAPI } from "notion-client";

const notionToken = process.env.NOTION_KEY;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionUser = process.env.NOTION_USER_ID;
const notionTokenv2 = process.env.NOTION_TOKEN_V2;

const notion = new Client({
  auth: notionToken,
});

const notionApi = new NotionAPI({
  activeUser: notionUser,
  authToken: notionTokenv2,
});

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: notionDatabaseId as string,
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

export async function getPostMetadata(id: string) {
  const response = await notion.pages.retrieve({
    page_id: id,
  });

  const title = (response as any).properties["제목"].title[0].plain_text;

  return {
    title,
  };
}

export async function getDatabaseTags() {
  const response = await notion.databases.retrieve({
    database_id: notionDatabaseId as string,
  });

  const tags = (response as any).properties["Tags"].multi_select.options;

  return tags as Tag[];
}

export async function getPage(id: string) {
  const response = await notionApi.getPage(id);

  return response;
}
