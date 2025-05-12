import type { Post } from "@/entities/posts/model";
import { TagChip } from "@/shared/ui";
import Image from "next/image";
import Link from "next/link";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const { cover, title, slugifiedTitle, publishTime, icon, tags } = post;

  return (
    <Link href={`/posts/${slugifiedTitle}`} className="mx-auto block h-min">
      <article className="clickable hover:-translate-x-1 hover:-translate-y-1 flex w-80 flex-col items-center rounded-sm shadow-lg">
        <div className="relative">
          <Image
            src={cover}
            alt="cover"
            width={320}
            height={200}
            style={{ width: 320, height: 200 }}
          />
          <p className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full break-words text-center text-white">
            {title}
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-1">
          <time className="self-end p-1 text-sm">{publishTime}</time>
          <Image src={icon} alt="icon" width={24} height={24} />
          <h2 className="w-full truncate px-3 text-center">{title}</h2>
          <div className="flex gap-2 p-1 pb-1.5">
            {tags.map(({ id, name, color }) => (
              <TagChip key={`_${name}`} id={id} name={name} color={color} />
            ))}
          </div>
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
