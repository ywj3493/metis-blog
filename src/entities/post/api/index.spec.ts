import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MOCK_PAGE_RECORD_MAP,
  MOCK_POSTS,
  MOCK_TAGS,
} from "@/shared/api/notion-mock";

vi.mock("next/cache", () => ({
  unstable_cache: (fn: unknown) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/shared/api", () => ({
  notion: {
    databases: { query: vi.fn(), retrieve: vi.fn() },
    pages: { retrieve: vi.fn(), update: vi.fn() },
    blocks: { children: { list: vi.fn() } },
  },
  notionApi: { getPage: vi.fn() },
  getOpenAIClient: vi.fn(),
}));

type MockFn = ReturnType<typeof vi.fn>;

async function load({
  ci = false,
  postDb = "",
  aboutPage = "",
}: {
  ci?: boolean;
  postDb?: string;
  aboutPage?: string;
} = {}) {
  vi.resetModules();
  vi.stubEnv("CI_MOCK", ci ? "true" : "");
  vi.stubEnv("NOTION_POST_DATABASE_ID", postDb);
  vi.stubEnv("NOTION_ABOUT_PAGE_ID", aboutPage);
  const api = await import("@/shared/api");
  const mod = await import("./index");
  return {
    mod,
    notion: api.notion as unknown as {
      databases: { query: MockFn; retrieve: MockFn };
      pages: { retrieve: MockFn; update: MockFn };
      blocks: { children: { list: MockFn } };
    },
    notionApi: api.notionApi as unknown as { getPage: MockFn },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("getNotionPosts", () => {
  it("returns MOCK_POSTS when CI_MOCK is true", async () => {
    const { mod } = await load({ ci: true });
    expect(await mod.getNotionPosts()).toStrictEqual(MOCK_POSTS);
  });

  it("throws when the database id is not set", async () => {
    const { mod } = await load({ ci: false, postDb: "" });
    await expect(mod.getNotionPosts()).rejects.toThrow(
      "notionPostDatabaseId is not settled.",
    );
  });

  it("queries the database and returns the results", async () => {
    const { mod, notion } = await load({ ci: false, postDb: "post-db" });
    const results = [{ id: "p-1" }];
    notion.databases.query.mockResolvedValue({ results });

    expect(await mod.getNotionPosts()).toBe(results);
    const call = notion.databases.query.mock.calls[0][0];
    expect(call.database_id).toBe("post-db");
    expect(call.filter.status.equals).toBe("공개");
    expect(call.sorts[0].property).toBe("날짜");
  });
});

describe("getNotionPostDatabaseTags", () => {
  it("returns MOCK_TAGS when CI_MOCK is true", async () => {
    const { mod } = await load({ ci: true });
    expect(await mod.getNotionPostDatabaseTags()).toStrictEqual(MOCK_TAGS);
  });

  it("throws when the database id is not set", async () => {
    const { mod } = await load({ ci: false, postDb: "" });
    await expect(mod.getNotionPostDatabaseTags()).rejects.toThrow(
      "notionPostDatabaseId is not settled.",
    );
  });

  it("retrieves the database and returns the tag options", async () => {
    const { mod, notion } = await load({ ci: false, postDb: "post-db" });
    const tags = [{ id: "t-1", name: "test", color: "gray" }];
    notion.databases.retrieve.mockResolvedValue({
      properties: { Tags: { multi_select: { options: tags } } },
    });

    expect(await mod.getNotionPostDatabaseTags()).toBe(tags);
    expect(notion.databases.retrieve.mock.calls[0][0].database_id).toBe(
      "post-db",
    );
  });
});

describe("getNotionPostContentForSummary", () => {
  const pageResponse = (summaryRichText: { plain_text: string }[]) => ({
    properties: {
      제목: { title: [{ plain_text: "포스트 제목" }] },
      summary: { rich_text: summaryRichText },
    },
  });

  const contentResponse = {
    results: [
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{ plain_text: "본문1" }, { plain_text: "본문2" }],
        },
      },
      { type: "heading_1", heading_1: {} },
    ],
  };

  it("builds content and marks isSummarized true when a summary exists", async () => {
    const { mod, notion } = await load();
    notion.pages.retrieve.mockResolvedValue(
      pageResponse([{ plain_text: "요약본" }]),
    );
    notion.blocks.children.list.mockResolvedValue(contentResponse);

    const result = await mod.getNotionPostContentForSummary("post-id");

    expect(result).toEqual({
      title: "포스트 제목",
      content: "본문1본문2",
      isSummarized: true,
    });
    expect(notion.pages.retrieve.mock.calls[0][0].page_id).toBe("post-id");
    expect(notion.blocks.children.list.mock.calls[0][0].block_id).toBe(
      "post-id",
    );
  });

  it("marks isSummarized false when the summary is empty", async () => {
    const { mod, notion } = await load();
    notion.pages.retrieve.mockResolvedValue(pageResponse([]));
    notion.blocks.children.list.mockResolvedValue(contentResponse);

    const result = await mod.getNotionPostContentForSummary("post-id");

    expect(result.isSummarized).toBe(false);
  });

  it("throws a NotionApiError when retrieval fails", async () => {
    const { mod, notion } = await load();
    notion.pages.retrieve.mockRejectedValue(new Error("boom"));

    await expect(mod.getNotionPostContentForSummary("post-id")).rejects.toThrow(
      "포스트 조회 실패: post-id",
    );
  });
});

describe("getNotionPage", () => {
  it("returns the mock record map when CI_MOCK is true", async () => {
    const { mod } = await load({ ci: true });
    expect(await mod.getNotionPage("id")).toStrictEqual(MOCK_PAGE_RECORD_MAP);
  });

  it("calls notionApi.getPage otherwise", async () => {
    const { mod, notionApi } = await load({ ci: false });
    const page = { block: {} };
    notionApi.getPage.mockResolvedValue(page);

    expect(await mod.getNotionPage("page-id")).toBe(page);
    expect(notionApi.getPage).toHaveBeenCalledWith("page-id");
  });
});

describe("getNotionAboutPage", () => {
  it("returns the mock record map when CI_MOCK is true", async () => {
    const { mod } = await load({ ci: true });
    expect(await mod.getNotionAboutPage()).toStrictEqual(MOCK_PAGE_RECORD_MAP);
  });

  it("throws when the about page id is not set", async () => {
    const { mod } = await load({ ci: false, aboutPage: "" });
    await expect(mod.getNotionAboutPage()).rejects.toThrow(
      "notionAboutPageID is not settled.",
    );
  });

  it("calls notionApi.getPage with the about page id", async () => {
    const { mod, notionApi } = await load({
      ci: false,
      aboutPage: "about-id",
    });
    const page = { block: {} };
    notionApi.getPage.mockResolvedValue(page);

    expect(await mod.getNotionAboutPage()).toBe(page);
    expect(notionApi.getPage).toHaveBeenCalledWith("about-id");
  });
});

describe("getSlugMap", () => {
  it("builds a slug to id map from the posts", async () => {
    const { mod } = await load({ ci: true });
    const slugMap = await mod.getSlugMap();
    expect(slugMap).toEqual({
      "ci-mock-post": "00000000-0000-0000-0000-000000000001",
    });
  });
});

describe("patchNotionPostSummary", () => {
  it("updates the post summary and returns the response", async () => {
    const { mod, notion } = await load();
    const response = { id: "post-1" };
    notion.pages.update.mockResolvedValue(response);

    expect(await mod.patchNotionPostSummary("post-1", "요약")).toBe(response);
    const call = notion.pages.update.mock.calls[0][0];
    expect(call.page_id).toBe("post-1");
    expect(call.properties.summary.rich_text[0].text.content).toBe("요약");
  });

  it("throws a NotionApiError when the update fails", async () => {
    const { mod, notion } = await load();
    notion.pages.update.mockRejectedValue(new Error("boom"));

    await expect(mod.patchNotionPostSummary("post-1", "요약")).rejects.toThrow(
      "포스트 요약 업데이트 실패: post-1",
    );
  });
});
