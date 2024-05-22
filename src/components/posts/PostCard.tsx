import Link from "next/link";
import Tag from "./Tag";
import Image from "next/image";

type PostCardProps = {
  // Notion API response 가 type 과 안 맞기 때문
  data: any;
};

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

export default function PostCard({ data }: PostCardProps) {
  const title = data.properties["제목"].title[0].plain_text as string;
  const tags = data.properties["Tags"].multi_select as {
    name: string;
    color: string;
  }[];
  const cover = data.cover?.external.url as string;
  const icon = data.icon ? (data.icon.external.url as string) : "/mascot.png";
  const publishTime = data.properties["날짜"].date.start;

  return (
    <Link
      className="clickable flex flex-col items-center w-320 shadow-lg"
      href={`/posts/${data.id}`}
    >
      <Image
        src={cover}
        alt="cover"
        width={320}
        height={200}
        style={{ width: 320, height: 200 }}
      />
      <div className="flex flex-row-reverse w-full p-4 text-14">
        <div>{publishTime}</div>
      </div>
      <h2 className="flex items-center gap-4 p-4">
        <Image src={icon} alt="icon" width={24} height={24} />
        {title}
      </h2>
      <div className="flex gap-8 p-4 pb-6">
        {tags.map(({ name, color }) => (
          <Tag key={`_${name}`} name={name} color={color} />
        ))}
      </div>
    </Link>
  );
}
