import { describe, expect, it, vi } from "vitest";
import { nextServerCache } from "@/shared/lib/cache";

const { unstableCacheMock } = vi.hoisted(() => ({
  unstableCacheMock: vi.fn(
    (fn: (...args: unknown[]) => Promise<unknown>) => fn,
  ),
}));

vi.mock("next/cache", () => ({
  unstable_cache: unstableCacheMock,
}));

describe("nextServerCache", () => {
  // vitest(react 18.3.1)에서는 React.cache 가 없어 identity 폴백 경로를 통과한다.
  it("래핑된 함수를 호출하면 원본 함수의 결과를 그대로 반환한다", async () => {
    const fn = vi.fn(async (...args: unknown[]) => args);
    const cached = nextServerCache(fn, ["test-key"]);

    await expect(cached("a", 1)).resolves.toEqual(["a", 1]);
    expect(fn).toHaveBeenCalledWith("a", 1);
  });

  it("unstable_cache 에 캐시 키와 기본 revalidate 를 전달한다", async () => {
    const fn = vi.fn(async () => "value");
    nextServerCache(fn, ["posts"]);

    expect(unstableCacheMock).toHaveBeenCalledWith(fn, ["posts"], {
      revalidate: expect.any(Number),
    });
  });

  it("옵션으로 revalidate 와 tags 를 재정의할 수 있다", async () => {
    const fn = vi.fn(async () => "value");
    nextServerCache(fn, ["posts"], { revalidate: false, tags: ["posts"] });

    expect(unstableCacheMock).toHaveBeenCalledWith(fn, ["posts"], {
      revalidate: false,
      tags: ["posts"],
    });
  });
});
