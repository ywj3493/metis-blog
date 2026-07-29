import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("CACHE_CONFIG", () => {
  it("uses 30s ISR revalidate time and 30000ms TTL in development", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "development");
    const { CACHE_CONFIG } = await import("./index");
    expect(CACHE_CONFIG.ISR_REVALIDATE_TIME).toBe(30);
    expect(CACHE_CONFIG.MEMORY_CACHE_TTL).toBe(30_000);
  });

  it("uses 300s ISR revalidate time and 300000ms TTL outside development", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    const { CACHE_CONFIG } = await import("./index");
    expect(CACHE_CONFIG.ISR_REVALIDATE_TIME).toBe(300);
    expect(CACHE_CONFIG.MEMORY_CACHE_TTL).toBe(300_000);
  });
});

describe("SUMMARY_MODEL_CONFIG", () => {
  it("uses LOCAL_AI_MODEL when set in development", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_AI_MODEL", "llama3");
    const { SUMMARY_MODEL_CONFIG } = await import("./index");
    expect(SUMMARY_MODEL_CONFIG.model).toBe("llama3");
    expect(SUMMARY_MODEL_CONFIG.temperature).toBe(0.2);
    expect(SUMMARY_MODEL_CONFIG.max_tokens).toBe(50);
    expect(SUMMARY_MODEL_CONFIG.top_p).toBe(0.9);
  });

  it("falls back to gemma3:1b when LOCAL_AI_MODEL is unset in development", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_AI_MODEL", "");
    // Ensure the env var is truly unset (stubEnv "" still defines it).
    const original = process.env.LOCAL_AI_MODEL;
    Reflect.deleteProperty(process.env, "LOCAL_AI_MODEL");
    const { SUMMARY_MODEL_CONFIG } = await import("./index");
    expect(SUMMARY_MODEL_CONFIG.model).toBe("gemma3:1b");
    if (original !== undefined) process.env.LOCAL_AI_MODEL = original;
  });

  it("uses gpt-4o-mini outside development", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    const { SUMMARY_MODEL_CONFIG } = await import("./index");
    expect(SUMMARY_MODEL_CONFIG.model).toBe("gpt-4o-mini");
  });
});
