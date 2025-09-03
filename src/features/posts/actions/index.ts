"use server";

import { revalidateTag } from "next/cache";
import {
  getNotionPostContentForSummary,
  patchNotionPostSummary,
} from "@/features/notion/model";
import { getAISummary } from "@/features/openai/model";

export async function updateAISummaryAction(postId: string) {
  try {
    const { title, content } = await getNotionPostContentForSummary(postId);

    // 1. AI 요약 생성 및 Notion 업데이트
    const newSummary = await getAISummary(title, content);

    const updatedPost = await patchNotionPostSummary(postId, newSummary);

    // 2. 캐시 무효화
    revalidateTag("posts");

    console.log(`✅ AI 요약 업데이트 완료: ${newSummary}`);
    console.log(`✅ Notion 포스트 업데이트 완료: ${updatedPost.id}`);

    return { success: true, summary: newSummary };
  } catch (error) {
    console.error(`❌ AI 요약 업데이트 실패:`, error);
  }
}
