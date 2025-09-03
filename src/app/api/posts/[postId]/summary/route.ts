import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import {
  getNotionPostContentForSummary,
  patchNotionPostSummary,
} from "@/entities/notion/model";
import { getAISummary } from "@/entities/openai/model";

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
    const newSummary = await getAISummary(title, content);

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
    console.error(`❌ [API Route] AI 요약 업데이트 실패 (${postId}):`, error);

    let errorMessage = "AI 요약 생성에 실패했습니다.";

    if (error instanceof Error) {
      if (error.message.includes("unauthorized")) {
        errorMessage = "Notion API 권한이 부족합니다.";
      } else if (error.message.includes("not found")) {
        errorMessage = "포스트를 찾을 수 없습니다.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "요청 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.";
      } else {
        errorMessage = error.message;
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500 },
    );
  }
}
