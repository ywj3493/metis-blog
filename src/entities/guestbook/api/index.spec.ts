import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/api", () => ({
  notion: {
    pages: { create: vi.fn() },
    databases: { query: vi.fn() },
  },
}));

async function load(dbId?: string) {
  vi.resetModules();
  if (dbId !== undefined) {
    vi.stubEnv("NOTION_GUESTBOOK_DATABASE_ID", dbId);
  } else {
    vi.stubEnv("NOTION_GUESTBOOK_DATABASE_ID", "");
  }
  const api = await import("@/shared/api");
  const mod = await import("./index");
  return { mod, notion: api.notion };
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("postNotionGuestbook", () => {
  it("throws when the database id is not set", async () => {
    const { mod } = await load();
    await expect(
      mod.postNotionGuestbook({
        name: "홍길동",
        content: "안녕",
        isPrivate: false,
      }),
    ).rejects.toThrow("notionGuestbookDatabaseId is not settled.");
  });

  it("creates a public guestbook when isPrivate is false", async () => {
    const { mod, notion } = await load("db-1");
    (notion.pages.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "page-1",
    });

    const result = await mod.postNotionGuestbook({
      name: "홍길동",
      content: "안녕",
      isPrivate: false,
    });

    expect(result).toEqual({
      id: "page-1",
      name: "홍길동",
      content: "안녕",
      isPrivate: false,
    });

    const call = (notion.pages.create as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(call.parent.database_id).toBe("db-1");
    expect(call.properties.상태.status.name).toBe("공개");
    expect(call.properties.작성자.title[0].text.content).toBe(
      "홍길동 님의 방명록",
    );
    expect(call.properties.방명록.rich_text[0].text.content).toBe("안녕");
  });

  it("creates a private guestbook when isPrivate is true", async () => {
    const { mod, notion } = await load("db-1");
    (notion.pages.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "page-2",
    });

    const result = await mod.postNotionGuestbook({
      name: "이몽룡",
      content: "비밀",
      isPrivate: true,
    });

    expect(result.isPrivate).toBe(true);
    const call = (notion.pages.create as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(call.properties.상태.status.name).toBe("비공개");
  });
});

describe("getNotionGuestbooks", () => {
  it("throws when the database id is not set", async () => {
    const { mod } = await load();
    await expect(mod.getNotionGuestbooks()).rejects.toThrow(
      "notionGuestbookDatabaseId is not settled.",
    );
  });

  it("returns the query results", async () => {
    const { mod, notion } = await load("db-1");
    const results = [{ id: "g-1" }, { id: "g-2" }];
    (notion.databases.query as ReturnType<typeof vi.fn>).mockResolvedValue({
      results,
    });

    const response = await mod.getNotionGuestbooks();

    expect(response).toBe(results);
    const call = (notion.databases.query as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(call.database_id).toBe("db-1");
    expect(call.sorts[0].property).toBe("남긴날짜");
  });
});
