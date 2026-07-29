import { describe, expect, it, vi } from "vitest";

vi.mock("@notionhq/client", () => ({ Client: vi.fn() }));
vi.mock("notion-client", () => ({ NotionAPI: vi.fn() }));
vi.mock("openai", () => ({ default: vi.fn() }));

describe("shared/api barrel", () => {
  it("re-exports notion clients and the OpenAI client factory", async () => {
    const api = await import("./index");
    expect(api.notion).toBeDefined();
    expect(api.notionApi).toBeDefined();
    expect(typeof api.getOpenAIClient).toBe("function");
  });
});
