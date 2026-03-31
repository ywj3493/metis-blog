import { APIErrorCode, isNotionClientError } from "@notionhq/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import {
  getNotionPostContentForSummary,
  patchNotionPostSummary,
} from "@/entities/post/api";
import { getSummary } from "@/features/summary/api";
import { NotionApiError, SummaryServiceError } from "@/shared/lib";

export async function PATCH(
  _: NextRequest,
  { params }: { params: { postId: string } },
) {
  const { postId } = params;

  try {
    // 1. 포스트 내용 가져오기
    const { title, content, isSummarized } =
      await getNotionPostContentForSummary(postId);

    if (isSummarized) {
      throw new Error("이미 요약이 생성된 포스트입니다.");
    }

    // 2. AI 요약 생성
    const newSummary = await getSummary(title, content);

    // 3. Notion 업데이트
    await patchNotionPostSummary(postId, newSummary);

    // 4. 캐시 무효화 (API Route에서 직접 호출)
    revalidateTag("posts");
    revalidatePath("/posts");
    revalidatePath("/");

    const result = {
      success: true,
      summary: newSummary,
      message: "AI 요약이 성공적으로 생성되었습니다.",
    };

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`❌ [API Route] 요약 업데이트 실패 (${postId}):`, error);

    if (error instanceof NotionApiError) {
      const cause = error.cause;
      if (isNotionClientError(cause)) {
        if (cause.code === APIErrorCode.ObjectNotFound) {
          return NextResponse.json(
            { success: false, error: "포스트를 찾을 수 없습니다." },
            { status: 404 },
          );
        }
        if (cause.code === APIErrorCode.RateLimited) {
          return NextResponse.json(
            {
              success: false,
              error: "요청 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.",
            },
            { status: 429 },
          );
        }
        if (cause.code === APIErrorCode.Unauthorized) {
          return NextResponse.json(
            { success: false, error: "Notion API 권한이 부족합니다." },
            { status: 403 },
          );
        }
      }
      return NextResponse.json(
        { success: false, error: "Notion API 요청에 실패했습니다." },
        { status: 502 },
      );
    }

    if (error instanceof SummaryServiceError) {
      return NextResponse.json(
        { success: false, error: "요약 서비스에 문제가 발생했습니다." },
        { status: 502 },
      );
    }

    const message =
      error instanceof Error ? error.message : "요약 생성에 실패했습니다.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
