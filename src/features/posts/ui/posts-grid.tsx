import { PostCard } from "@/entities/posts/ui";
import type { Post } from "../model";

type PostsGridProps = {
  posts: Post[];
};

export function PostsGrid({ posts }: PostsGridProps) {
  return (
    <ul className="grid grid-cols-1 lx:grid-cols-4 gap-16 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  );
}
