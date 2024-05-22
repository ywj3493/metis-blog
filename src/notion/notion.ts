import { Client } from "@notionhq/client";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAPI } from "notion-client";

const notionToken = process.env.NOTION_KEY;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

const notion = new Client({
  auth: notionToken,
});

const notionApi = new NotionAPI();

export async function getDatabaseList() {
  const response = await notion.databases.query({
    database_id: notionDatabaseId as string,
    filter: {
      property: "상태",
      status: {
        equals: "공개",
      },
    },
  });

  return response.results as DatabaseObjectResponse[];
}

export async function getPage(id: string) {
  const response = await notionApi.getPage(id);

  return response;
}
