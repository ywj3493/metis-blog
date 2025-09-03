import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/entities/posts/model";
// import 때문에 next 서버 쪽 모듈들이 흘러들어옴
import { AISummaryButton } from "@/features/posts/ui/ai-summary-button";
import { TagChip } from "@/shared/ui";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const {
    id,
    cover,
    title,
    slugifiedTitle,
    publishTime,
    icon,
    tags,
    aiSummary,
    aiSummarized,
  } = post;

  return (
    <Link href={`/posts/${slugifiedTitle}`} className="mx-auto block h-min">
      <article className="clickable hover:-translate-x-1 hover:-translate-y-1 flex w-80 flex-col overflow-hidden rounded-sm bg-white shadow-lg dark:bg-gray-800">
        {/* 이미지와 오버레이 메타데이터 섹션 */}
        <div className="relative">
          <Image
            src={cover}
            alt="cover"
            width={320}
            height={200}
            style={{ width: "100%", height: 200 }}
            className="object-cover"
          />

          {/* 배경 그라디언트 오버레이 */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* 상단 메타데이터 오버레이 */}
          <div className="absolute top-0 right-0 left-0 z-20 p-4">
            <div className="mb-2 flex items-center gap-2">
              {icon && (
                <Image
                  src={icon}
                  alt="icon"
                  width={20}
                  height={20}
                  className="rounded"
                />
              )}
              <time className="text-sm text-white/90">{publishTime}</time>
            </div>

            <div className="flex flex-wrap gap-1">
              {tags.map(({ id, name, color }) => (
                <TagChip key={`_${name}`} id={id} name={name} color={color} />
              ))}
            </div>
          </div>

          {/* 하단 제목 오버레이 */}
          <div className="absolute right-0 bottom-0 left-0 z-20 p-4">
            <h2
              className="mb-0 overflow-hidden font-semibold text-lg text-white"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: "1.5em",
                maxHeight: "3em",
              }}
            >
              {title}
            </h2>
          </div>
        </div>

        {/* AI 요약 섹션 */}
        <div className="p-4">
          {aiSummarized && aiSummary ? (
            // AI 요약이 있는 경우 (서버 컴포넌트에서 렌더링)
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="line-clamp-3 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                💡 {aiSummary}
              </p>
            </div>
          ) : (
            // AI 요약이 없는 경우 (클라이언트 컴포넌트로 위임)
            <AISummaryButton postId={id} />
          )}
        </div>
      </article>
    </Link>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="skeleton-card h-300 w-320 space-y-4 rounded-lg bg-gray-100 p-4">
      <div className="skeleton-image h-44 w-full animate-pulse rounded-lg bg-gray-200" />
      <div className="skeleton-text-line h-5 w-full animate-pulse rounded bg-gray-200" />
      <div className="skeleton-text-line short h-5 w-3/5 animate-pulse rounded bg-gray-200" />
      <div className="skeleton-tags flex space-x-2">
        <div className="skeleton-tag h-5 w-12 animate-pulse rounded bg-gray-200" />
        <div className="skeleton-tag h-5 w-12 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
