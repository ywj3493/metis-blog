import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion, notionApi } from "@/shared/api";
import {
  MOCK_PAGE_RECORD_MAP,
  MOCK_POSTS,
  MOCK_TAGS,
} from "@/shared/api/notion-mock";
import { NotionApiError } from "@/shared/lib";
import { nextServerCache } from "@/shared/lib/cache";
import { Post } from "../model";
import type { TagDatabaseResponse } from "../model/type";

const notionAboutPageID = process.env.NOTION_ABOUT_PAGE_ID;
const notionPostDatabaseId = process.env.NOTION_POST_DATABASE_ID;
const isCiMock = process.env.CI_MOCK === "true";

async function _getNotionPosts() {
  if (isCiMock) return MOCK_POSTS;

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

async function _getNotionPostContentForSummary(id: string) {
  try {
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
  } catch (error) {
    throw new NotionApiError(`포스트 조회 실패: ${id}`, error);
  }
}

async function _getNotionPostDatabaseTags() {
  if (isCiMock) return MOCK_TAGS as TagDatabaseResponse[];

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
  if (isCiMock) return MOCK_PAGE_RECORD_MAP as never;

  const response = await notionApi.getPage(id);
  return response;
}

async function _getNotionAboutPage() {
  if (isCiMock) return MOCK_PAGE_RECORD_MAP as never;

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
  try {
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
  } catch (error) {
    throw new NotionApiError(`포스트 요약 업데이트 실패: ${postId}`, error);
  }
};

export const getNotionPosts = nextServerCache(_getNotionPosts, ["posts"]);
export const getNotionPostDatabaseTags = nextServerCache(
  _getNotionPostDatabaseTags,
  ["tags"],
);
// getNotionPage / getNotionAboutPage 는 의도적으로 nextServerCache 를 적용하지 않는다:
// - recordMap 의 signed_urls(S3 presigned URL)는 약 1시간 뒤 만료되는데, 데이터 캐시의
//   stale-while-revalidate 특성상 만료된 이미지 URL 이 서빙될 수 있다.
// - Vercel 데이터 캐시는 항목당 약 2MB 제한이 있어 이미지가 많은 포스트는 조용히 캐시가 스킵된다.
// - 페이지 자체가 온디맨드 ISR 로 캐시되어 slug 당 revalidate 주기에 1회만 렌더링되므로
//   데이터 캐시를 겹쳐도 이득이 없다.
export const getNotionPage = _getNotionPage;
export const getNotionAboutPage = _getNotionAboutPage;
export const getNotionPostContentForSummary = _getNotionPostContentForSummary;
export const getSlugMap = _getSlugMap;
export const patchNotionPostSummary = _patchNotionPostSummary;
