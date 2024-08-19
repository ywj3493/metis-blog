import Link from "next/link";
import Image from "next/image";
import { Post } from "@/adapters/posts";
import TagChip from "./TagChip";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const { id, cover, title, publishTime, icon, tags } = post;

  return (
    <Link href={`/posts/${id}`} className="block mx-auto h-min">
      <article className="clickable flex flex-col items-center w-320 shadow-lg rounded-sm hover:-translate-x-1 hover:-translate-y-1">
        <div className={`relative`}>
          <Image
            src={cover}
            alt="cover"
            width={320}
            height={200}
            style={{ width: 320, height: 200 }}
          />
          <p className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white break-words">
            {title}
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center w-full">
          <time className="self-end p-4 text-14">{publishTime}</time>
          <Image src={icon} alt="icon" width={24} height={24} />
          <h2 className="px-12 w-full text-center truncate">{title}</h2>
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
    <div className="skeleton-card space-y-4 p-4 w-320 h-300 bg-gray-100 rounded-lg">
      <div className="skeleton-image bg-gray-200 rounded-lg w-full h-44 animate-pulse"></div>
      <div className="skeleton-text-line bg-gray-200 rounded h-5 w-full animate-pulse"></div>
      <div className="skeleton-text-line short bg-gray-200 rounded h-5 w-3/5 animate-pulse"></div>
      <div className="skeleton-tags flex space-x-2">
        <div className="skeleton-tag bg-gray-200 rounded h-5 w-12 animate-pulse"></div>
        <div className="skeleton-tag bg-gray-200 rounded h-5 w-12 animate-pulse"></div>
      </div>
    </div>
  );
}
