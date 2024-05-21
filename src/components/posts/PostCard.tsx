import Link from "next/link";
import Tag from "./Tag";
import Image from "next/image";

type PostCardProps = {
  // Notion API response 가 type 과 안 맞기 때문
  data: any;
};

export default function PostCard({ data }: PostCardProps) {
  const title = data.properties["제목"].title[0].plain_text as string;
  const tags = data.properties["Tags"].multi_select as {
    name: string;
    color: string;
  }[];
  const cover = data.cover.external.url as string;
  const icon = data.icon.external.url as string;
  const createdTime = data.created_time.split("T")[0] as string;

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
      <div className="flex flex-row-reverse w-full p-4">
        <div>{createdTime}</div>
      </div>
      <h2 className="flex items-center gap-4 p-4">
        <Image src={icon} alt="icon" width={24} height={24} />
        {title}
      </h2>
      <div className="flex gap-8 p-4">
        {tags.map(({ name, color }) => (
          <Tag key={`_${name}`} name={name} color={color} />
        ))}
      </div>
    </Link>
  );
}
