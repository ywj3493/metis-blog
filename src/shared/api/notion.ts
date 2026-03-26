import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

const notionToken = process.env.NOTION_KEY;
const notionUser = process.env.NOTION_USER_ID;
const notionTokenV2 = process.env.NOTION_TOKEN_V2;

export const notion = new Client({
  auth: notionToken,
});

export const notionApi = new NotionAPI({
  activeUser: notionUser,
  authToken: notionTokenV2,
});
