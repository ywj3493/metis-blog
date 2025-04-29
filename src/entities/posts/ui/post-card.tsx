import type { Post } from "@/features/posts/model";
import { TagChip } from "@/shared/ui";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "../utils";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const { cover, title, publishTime, icon, tags } = post;

  return (
    <Link href={`/posts/${slugify(title)}`} className="mx-auto block h-min">
      <article className="clickable hover:-translate-x-1 hover:-translate-y-1 flex w-320 flex-col items-center rounded-sm shadow-lg">
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
        <div className="flex w-full flex-col items-center gap-4">
          <time className="self-end p-4 text-14">{publishTime}</time>
          <Image src={icon} alt="icon" width={24} height={24} />
          <h2 className="w-full truncate px-12 text-center">{title}</h2>
          <div className="flex gap-8 p-4 pb-6">
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
