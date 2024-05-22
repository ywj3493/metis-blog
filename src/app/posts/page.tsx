import PostCard, { PostCardSkeleton } from "@/components/posts/PostCard";
import { getDatabaseList } from "@/notion/notion";
import { Suspense } from "react";

export const revalidate = 86400;

export default async function PostListPage() {
  const pages = await getDatabaseList();

  return (
    <div className="flex flex-col gap-8 w-full items-center p-32 overflow-y-auto">
      {pages.map((page) => (
        <Suspense key={page.id} fallback={PostCardSkeleton()}>
          <PostCard data={page} />
        </Suspense>
      ))}
    </div>
  );
}
