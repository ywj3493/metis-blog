import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/entities/posts/model";
import { TagChip } from "@/shared/ui";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const { cover, title, slugifiedTitle, publishTime, icon, tags, aiSummary } =
    post;

  return (
    <Link href={`/posts/${slugifiedTitle}`} className="mx-auto block h-min">
      <article className="clickable hover:-translate-x-1 hover:-translate-y-1 flex w-80 flex-col rounded-sm shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

          {/* 상단 메타데이터 오버레이 */}
          <div className="absolute top-0 left-0 right-0 p-4 z-20">
            <div className="flex items-center gap-2 mb-2">
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
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h2
              className="text-lg font-semibold text-white mb-0 overflow-hidden"
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
        {aiSummary && (
          <div className="p-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                💡AI 요약: {aiSummary}
              </p>
            </div>
          </div>
        )}
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
