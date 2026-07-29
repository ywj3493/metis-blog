import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const constructorCalls: Array<Record<string, unknown>> = [];

vi.mock("openai", () => ({
  default: vi.fn(function (this: Record<string, unknown>, opts: unknown) {
    this.opts = opts;
    constructorCalls.push(opts as Record<string, unknown>);
  }),
}));

beforeEach(() => {
  constructorCalls.length = 0;
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("getOpenAIClient", () => {
  it("caches the client as a singleton (second call returns same instance)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    const { getOpenAIClient } = await import("./openai");

    const first = getOpenAIClient();
    const second = getOpenAIClient();

    expect(first).toBe(second);
    // Constructor invoked only once due to caching.
    expect(constructorCalls).toHaveLength(1);
  });

  it("uses OPENAI_API_KEY and undefined baseURL in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("OPENAI_API_KEY", "sk-prod");
    const { getOpenAIClient } = await import("./openai");

    getOpenAIClient();

    expect(constructorCalls[0]).toEqual({
      apiKey: "sk-prod",
      baseURL: undefined,
    });
  });

  it("uses ollama key and LOCAL_AI_ENDPOINT baseURL in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_AI_ENDPOINT", "http://my-ollama:9999");
    const { getOpenAIClient } = await import("./openai");

    getOpenAIClient();

    expect(constructorCalls[0]).toEqual({
      apiKey: "ollama",
      baseURL: "http://my-ollama:9999/v1",
    });
  });

  it("falls back to localhost:11434 baseURL when LOCAL_AI_ENDPOINT unset in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const original = process.env.LOCAL_AI_ENDPOINT;
    Reflect.deleteProperty(process.env, "LOCAL_AI_ENDPOINT");
    const { getOpenAIClient } = await import("./openai");

    getOpenAIClient();

    expect(constructorCalls[0]).toEqual({
      apiKey: "ollama",
      baseURL: "http://localhost:11434/v1",
    });
    if (original !== undefined) process.env.LOCAL_AI_ENDPOINT = original;
  });
});
