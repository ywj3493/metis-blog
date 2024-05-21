import PostCard from "@/components/posts/PostCard";
import { getDatabaseList } from "@/notion/notion";

export default async function PostListPage() {
  const pages = await getDatabaseList();

  return (
    <div className="flex flex-col gap-8 w-full items-center p-32 overflow-y-auto">
      {pages.map((page) => (
        <PostCard key={page.id} data={page} />
      ))}
    </div>
  );
}
