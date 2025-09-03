import { revalidateTag } from "next/cache";
import {
  getNotionPostContentForSummary,
  patchNotionPostSummary,
} from "@/entities/notion/model";
import { getAISummary } from "@/entities/openai/model";

export async function patchPostSummary(postId: string) {
  try {
    const { title, content } = await getNotionPostContentForSummary(postId);

    // 1. AI 요약 생성 및 Notion 업데이트
    const newSummary = await getAISummary(title, content);

    await patchNotionPostSummary(postId, newSummary);

    // 2. 캐시 무효화
    revalidateTag("posts");

    return { success: true, summary: newSummary };
  } catch (error) {
    console.error(`❌ AI 요약 업데이트 실패:`, error);
  }
}
