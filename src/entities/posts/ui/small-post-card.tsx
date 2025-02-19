import Link from "next/link";
import Image from "next/image";
import { TagChip } from "@/shared/ui";
import { Post } from "@/features/posts/model";

type SmallPostCardProps = {
  post: Post;
};

export function SmallPostCard({ post }: SmallPostCardProps) {
  const { id, title, icon, tags } = post;
  return (
    <Link href={`/posts/${id}`} className="block text-black">
      <article className="clickable flex items-center py-10 w-340 shadow-lg rounded-sm hover:-translate-x-1 hover:-translate-y-1">
        <div className="flex flex-col gap-4 items-center w-full">
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
