import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/entities/posts/model";
import { TagChip } from "@/shared/ui";

type SmallPostCardProps = {
  post: Post;
};

export function SmallPostCard({ post }: SmallPostCardProps) {
  const { title, slugifiedTitle, icon, tags } = post;
  return (
    <Link href={`/posts/${slugifiedTitle}`} className="block text-black">
      <article className="clickable hover:-translate-x-1 hover:-translate-y-1 flex w-80 items-center rounded-sm py-2.5 shadow-lg">
        <div className="flex w-full flex-col items-center gap-1">
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
