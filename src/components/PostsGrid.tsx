import { PostCard } from "./posts/PostCard";
import { Post } from "@/adapters/posts";

type PostsGridProps = {
  posts: Post[];
};

export default function PostsGrid({ posts }: PostsGridProps) {
  return (
    <ul className="grid gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lx:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  );
}
