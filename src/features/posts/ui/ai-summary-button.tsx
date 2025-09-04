"use client";

import Image from "next/image";
import { useState } from "react";
import { AISummaryCard } from "@/entities/posts/ui/ai-summary-card";
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
    return <AISummaryCard summary={summary} />;
  }

  return (
    <div>
      <Button
        onClick={handleGenerateAISummary}
        disabled={isGenerating}
        className="group relative w-full overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 dark:border-blue-800/30 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 dark:hover:from-blue-900/30 dark:hover:via-purple-900/30 dark:hover:to-pink-900/30"
      >
        <div className="absolute top-2 right-2 opacity-10 transition-opacity group-hover:opacity-20">
          <Image
            src={"/mascot.png"}
            alt="mascot-background"
            width={60}
            height={60}
          />
        </div>

        {isGenerating ? (
          <div className="relative flex items-center gap-3">
            <div className="flex-shrink-0 rounded-full bg-white p-2 shadow-sm dark:bg-gray-800">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
            <div>
              <p className="font-medium text-blue-600 dark:text-blue-400">
                AI 요약 생성 중...
              </p>
              <p className="text-gray-500 text-xs dark:text-gray-400">
                메티가 열심히 읽고 있어요 📚
              </p>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center gap-3">
            <div className="flex-shrink-0 rounded-full bg-white p-2 shadow-sm transition-shadow group-hover:shadow-md dark:bg-gray-800">
              <Image
                src={"/mascot.png"}
                alt="mascot-icon"
                width={24}
                height={24}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                메티에게 요약을 요청해보세요!
              </p>
            </div>
          </div>
        )}
      </Button>

      {error && (
        <div className="mt-3 rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-3 dark:border-red-800/30 dark:from-red-950/20 dark:to-orange-950/20">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <Image
                src={"/mascot.png"}
                alt="mascot-sad"
                width={20}
                height={20}
                className="grayscale"
              />
            </div>
            <p className="text-red-600 text-sm dark:text-red-400">😔 {error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
