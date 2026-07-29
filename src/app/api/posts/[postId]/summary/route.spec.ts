import { revalidatePath, revalidateTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getNotionPostContentForSummary,
  patchNotionPostSummary,
} from "@/entities/post/api";
import { getSummary } from "@/features/summary/api";
import { NotionApiError, SummaryServiceError } from "@/shared/lib";
import { PATCH } from "./route";

vi.mock("@notionhq/client", () => ({
  isNotionClientError: (value: unknown) =>
    typeof value === "object" && value !== null && "code" in value,
  APIErrorCode: {
    ObjectNotFound: "object_not_found",
    RateLimited: "rate_limited",
    Unauthorized: "unauthorized",
  },
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/entities/post/api", () => ({
  getNotionPostContentForSummary: vi.fn(),
  patchNotionPostSummary: vi.fn(),
}));

vi.mock("@/features/summary/api", () => ({
  getSummary: vi.fn(),
}));

const mockedGetContent = vi.mocked(getNotionPostContentForSummary);
const mockedPatch = vi.mocked(patchNotionPostSummary);
const mockedGetSummary = vi.mocked(getSummary);
const mockedRevalidateTag = vi.mocked(revalidateTag);
const mockedRevalidatePath = vi.mocked(revalidatePath);

const params = { params: { postId: "post-1" } };

function callPatch() {
  // biome-ignore lint/suspicious/noExplicitAny: NextRequest is unused by handler
  return PATCH({} as any, params);
}

describe("PATCH /api/posts/[postId]/summary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 200 on happy path and invalidates cache", async () => {
    mockedGetContent.mockResolvedValueOnce({
      title: "t",
      content: "c",
      isSummarized: false,
    } as never);
    mockedGetSummary.mockResolvedValueOnce("s" as never);
    mockedPatch.mockResolvedValueOnce(undefined as never);

    const res = await callPatch();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({ success: true, summary: "s" });
    expect(mockedRevalidateTag).toHaveBeenCalledWith("posts");
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/posts");
    expect(mockedRevalidatePath).toHaveBeenCalledWith("/");
  });

  it("returns 500 when post is already summarized", async () => {
    mockedGetContent.mockResolvedValueOnce({
      title: "t",
      content: "c",
      isSummarized: true,
    } as never);

    const res = await callPatch();

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("이미 요약이 생성된 포스트입니다.");
  });

  it("returns 404 for NotionApiError ObjectNotFound cause", async () => {
    mockedGetContent.mockRejectedValueOnce(
      new NotionApiError("x", { code: "object_not_found" }),
    );

    const res = await callPatch();

    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe("포스트를 찾을 수 없습니다.");
  });

  it("returns 429 for NotionApiError RateLimited cause", async () => {
    mockedGetContent.mockRejectedValueOnce(
      new NotionApiError("x", { code: "rate_limited" }),
    );

    const res = await callPatch();

    expect(res.status).toBe(429);
    expect((await res.json()).error).toContain("요청 제한");
  });

  it("returns 403 for NotionApiError Unauthorized cause", async () => {
    mockedGetContent.mockRejectedValueOnce(
      new NotionApiError("x", { code: "unauthorized" }),
    );

    const res = await callPatch();

    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe("Notion API 권한이 부족합니다.");
  });

  it("returns 502 for NotionApiError with an unrecognized notion code", async () => {
    mockedGetContent.mockRejectedValueOnce(
      new NotionApiError("x", { code: "something_else" }),
    );

    const res = await callPatch();

    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("Notion API 요청에 실패했습니다.");
  });

  it("returns 502 for NotionApiError whose cause is not a notion client error", async () => {
    mockedGetContent.mockRejectedValueOnce(
      new NotionApiError("x", new Error("plain")),
    );

    const res = await callPatch();

    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("Notion API 요청에 실패했습니다.");
  });

  it("returns 502 for SummaryServiceError", async () => {
    mockedGetContent.mockResolvedValueOnce({
      title: "t",
      content: "c",
      isSummarized: false,
    } as never);
    mockedGetSummary.mockRejectedValueOnce(
      new SummaryServiceError("summary failed"),
    );

    const res = await callPatch();

    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("요약 서비스에 문제가 발생했습니다.");
  });

  it("returns 500 fallback for a non-Error thrown value", async () => {
    mockedGetContent.mockRejectedValueOnce("string error" as never);

    const res = await callPatch();

    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("요약 생성에 실패했습니다.");
  });
});
