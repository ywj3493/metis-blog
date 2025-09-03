"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { updatePostSummary } from "../api";

type AISummaryButtonProps = {
  postId: string;
};

export function AISummaryButton({ postId }: AISummaryButtonProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAISummary = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await updatePostSummary(postId);

      if (result?.success) {
        setSummary(result.summary);
      } else {
        setError(result?.error || "AI 요약 생성에 실패했습니다.");
      }
    } catch (error) {
      setError(
        "AI 요약 생성 중 오류가 발생했습니다. 페이지를 새로고침 해주세요.",
      );
      console.error("AI 요약 생성 실패:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 요약이 생성된 후에는 서버에서 다시 렌더링되도록 하거나
  // 로컬 상태로 표시
  if (summary) {
    return (
      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
        <p className="line-clamp-5 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
          💡 {summary}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Button
        onClick={handleGenerateAISummary}
        disabled={isGenerating}
        className="w-full rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3 text-left transition-all hover:from-blue-100 hover:to-purple-100 disabled:opacity-50 dark:from-blue-900/20 dark:to-purple-900/20 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30"
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <p className="text-blue-600 text-sm dark:text-blue-400">
              AI 요약 생성 중...
            </p>
          </div>
        ) : (
          <p className="text-gray-600 text-sm dark:text-gray-400">
            🤖 클릭하여 AI 요약 생성하기
          </p>
        )}
      </Button>

      {error && (
        <div className="mt-2 rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
          <p className="text-red-600 text-sm dark:text-red-400">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
