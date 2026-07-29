import { afterEach, describe, expect, it, vi } from "vitest";
// Import through the barrel to cover src/features/summary/api/index.ts
import { updatePostSummary } from "@/features/summary/api";

describe("updatePostSummary", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns data on a successful response", async () => {
    const data = { success: true, summary: "요약" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      }),
    );

    const result = await updatePostSummary("p1");

    expect(result).toEqual(data);
    expect(fetch).toHaveBeenCalledWith("/api/posts/p1/summary", {
      method: "PATCH",
    });
  });

  it("throws with the server message when response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ message: "서버 에러" }),
      }),
    );

    await expect(updatePostSummary("p1")).rejects.toThrow("서버 에러");
  });

  it("throws with the fallback message when no message is present", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      }),
    );

    await expect(updatePostSummary("p1")).rejects.toThrow(
      "블로그 포스트 요약 업데이트 실패",
    );
  });
});
