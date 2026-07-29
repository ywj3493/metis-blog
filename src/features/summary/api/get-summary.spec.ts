import { afterEach, describe, expect, it, vi } from "vitest";
// Import through the barrel to cover src/features/summary/api/index.ts
import { getSummary } from "@/features/summary/api";
import { getOpenAIClient } from "@/shared/api";
import { SummaryServiceError } from "@/shared/lib";

const createMock = vi.fn();

vi.mock("@/shared/api", () => ({
  getOpenAIClient: vi.fn(() => ({
    chat: { completions: { create: createMock } },
  })),
}));

describe("getSummary", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns the trimmed content on success", async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: "  요약 결과  " } }],
    });

    const result = await getSummary("제목", "본문 텍스트 입니다");

    expect(result).toBe("요약 결과");
    expect(getOpenAIClient).toHaveBeenCalled();
  });

  it("returns an empty string when content is null", async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: null } }],
    });

    const result = await getSummary("제목", "본문");

    expect(result).toBe("");
  });

  it("throws SummaryServiceError with the error message when create rejects with an Error", async () => {
    createMock.mockRejectedValue(new Error("API 실패"));

    await expect(getSummary("제목", "본문")).rejects.toBeInstanceOf(
      SummaryServiceError,
    );
    await expect(getSummary("제목", "본문")).rejects.toThrow("API 실패");
  });

  it("throws SummaryServiceError using String(error) for non-Error rejections", async () => {
    createMock.mockRejectedValue("문자열 에러");

    await expect(getSummary("제목", "본문")).rejects.toThrow("문자열 에러");
  });
});
