import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import { describe, expect, it, vi } from "vitest";

vi.mock("@notionhq/client", () => ({ Client: vi.fn() }));
vi.mock("notion-client", () => ({ NotionAPI: vi.fn() }));

describe("notion clients", () => {
  it("constructs the official and unofficial Notion clients at import", async () => {
    const { notion, notionApi } = await import("./notion");

    expect(notion).toBeDefined();
    expect(notionApi).toBeDefined();
    expect(Client).toHaveBeenCalledTimes(1);
    expect(NotionAPI).toHaveBeenCalledTimes(1);
    expect(vi.mocked(Client)).toHaveBeenCalledWith({
      auth: process.env.NOTION_KEY,
    });
    expect(vi.mocked(NotionAPI)).toHaveBeenCalledWith({
      activeUser: process.env.NOTION_USER_ID,
      authToken: process.env.NOTION_TOKEN_V2,
    });
  });
});
