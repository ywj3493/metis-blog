import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion, notionApi } from "@/shared/api";
import { nextServerCache } from "@/shared/lib/cache";
import { Post } from "../model";
import type { TagDatabaseResponse } from "../model/type";

const notionAboutPageID = process.env.NOTION_ABOUT_PAGE_ID;
const notionPostDatabaseId = process.env.NOTION_POST_DATABASE_ID;

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

async function _getNotionPage(id: string) {
  const response = await notionApi.getPage(id);

  return response;
}

async function _getNotionAboutPage() {
  if (!notionAboutPageID) {
    throw Error("notionAboutPageID is not settled.");
  }
  const response = await notionApi.getPage(notionAboutPageID);

  return response;
}

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

export const getNotionPosts = nextServerCache(_getNotionPosts, ["posts"]);
export const getNotionPostMetadata = _getNotionPostMetadata;
export const getNotionPostDatabaseTags = nextServerCache(
  _getNotionPostDatabaseTags,
  ["tags"],
);
export const getNotionPage = _getNotionPage;
export const getNotionAboutPage = _getNotionAboutPage;
export const getNotionPostContentForSummary = _getNotionPostContentForSummary;
export const getSlugMap = _getSlugMap;
export const patchNotionPostSummary = _patchNotionPostSummary;
