import type { Post } from "@/features/posts/model";
import { TagChip } from "@/shared/ui";
import Image from "next/image";
import Link from "next/link";

type SmallPostCardProps = {
  post: Post;
};

export function SmallPostCard({ post }: SmallPostCardProps) {
  const { title, slugifiedTitle, icon, tags } = post;
  return (
    <Link href={`/posts/${slugifiedTitle}`} className="block text-black">
      <article className="clickable hover:-translate-x-1 hover:-translate-y-1 flex w-340 items-center rounded-sm py-10 shadow-lg">
        <div className="flex w-full flex-col items-center gap-4">
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
