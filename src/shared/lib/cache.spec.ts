import { unstable_cache } from "next/cache";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CACHE_CONFIG } from "../config";
import { nextServerCache } from "./cache";

vi.mock("next/cache", () => ({
  unstable_cache: vi.fn((fn: unknown) => fn),
}));

const mockedUnstableCache = vi.mocked(unstable_cache);

beforeEach(() => {
  mockedUnstableCache.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("nextServerCache", () => {
  it("wraps the fn with default revalidate from CACHE_CONFIG when no options", async () => {
    const fn = vi.fn(async () => "value");
    const keys = ["a", "b"];

    const wrapped = nextServerCache(fn, keys);

    expect(mockedUnstableCache).toHaveBeenCalledTimes(1);
    expect(mockedUnstableCache).toHaveBeenCalledWith(fn, keys, {
      revalidate: CACHE_CONFIG.ISR_REVALIDATE_TIME,
    });
    // Our mock returns fn unchanged.
    expect(wrapped).toBe(fn);
    await expect(wrapped()).resolves.toBe("value");
  });

  it("merges provided options, overriding revalidate and adding tags", () => {
    const fn = vi.fn(async () => 1);
    const keys = ["k"];

    nextServerCache(fn, keys, { revalidate: 99, tags: ["posts"] });

    expect(mockedUnstableCache).toHaveBeenCalledWith(fn, keys, {
      revalidate: 99,
      tags: ["posts"],
    });
  });

  it("supports revalidate: false override", () => {
    const fn = vi.fn(async () => 1);

    nextServerCache(fn, ["k"], { revalidate: false });

    expect(mockedUnstableCache).toHaveBeenCalledWith(fn, ["k"], {
      revalidate: false,
    });
  });
});
