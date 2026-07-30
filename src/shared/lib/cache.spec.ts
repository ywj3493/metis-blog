import { afterEach, describe, expect, it, vi } from "vitest";
import { CACHE_CONFIG } from "../config";

// `unstable_cache` is mocked as identity so we can inspect its call args and
// follow the value through the outer `requestMemo` wrapper.
const { unstableCacheMock } = vi.hoisted(() => ({
  unstableCacheMock: vi.fn(
    (fn: (...args: unknown[]) => Promise<unknown>) => fn,
  ),
}));

vi.mock("next/cache", () => ({ unstable_cache: unstableCacheMock }));

/**
 * Load a fresh copy of cache.ts with a specific `react.cache` export so both
 * sides of the `typeof cache === "function"` ternary are covered.
 */
async function loadWithReactCache(reactCache: unknown) {
  vi.resetModules();
  vi.doMock("react", () => ({ cache: reactCache }));
  const { nextServerCache } = await import("./cache");
  return nextServerCache;
}

afterEach(() => {
  vi.doUnmock("react");
  vi.resetModules();
  unstableCacheMock.mockClear();
});

describe("nextServerCache", () => {
  describe("when React.cache is unavailable (identity requestMemo)", () => {
    it("passes fn, keys and the default revalidate to unstable_cache", async () => {
      const nextServerCache = await loadWithReactCache(undefined);
      const fn = vi.fn(async () => "value");
      const keys = ["a", "b"];

      const wrapped = nextServerCache(fn, keys);

      expect(unstableCacheMock).toHaveBeenCalledWith(fn, keys, {
        revalidate: CACHE_CONFIG.ISR_REVALIDATE_TIME,
      });
      // identity fallback returns the unstable_cache result unchanged
      expect(wrapped).toBe(fn);
      await expect(wrapped()).resolves.toBe("value");
    });

    it("merges provided options, overriding revalidate and adding tags", async () => {
      const nextServerCache = await loadWithReactCache(undefined);
      const fn = vi.fn(async () => 1);

      nextServerCache(fn, ["k"], { revalidate: 99, tags: ["posts"] });

      expect(unstableCacheMock).toHaveBeenCalledWith(fn, ["k"], {
        revalidate: 99,
        tags: ["posts"],
      });
    });

    it("supports revalidate: false override", async () => {
      const nextServerCache = await loadWithReactCache(undefined);
      const fn = vi.fn(async () => 1);

      nextServerCache(fn, ["k"], { revalidate: false });

      expect(unstableCacheMock).toHaveBeenCalledWith(fn, ["k"], {
        revalidate: false,
      });
    });
  });

  describe("when React.cache is available (server runtime)", () => {
    it("wraps the unstable_cache result with React.cache for per-request memoization", async () => {
      const requestMemoized = vi.fn();
      const reactCache = vi.fn(() => requestMemoized);
      const nextServerCache = await loadWithReactCache(reactCache);
      const fn = vi.fn(async () => "v");

      const wrapped = nextServerCache(fn, ["k"]);

      // requestMemo (= react.cache) memoizes the unstable_cache result (our
      // identity mock returns `fn`).
      expect(reactCache).toHaveBeenCalledWith(fn);
      expect(wrapped).toBe(requestMemoized);
    });
  });
});
