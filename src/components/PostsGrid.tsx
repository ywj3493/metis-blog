import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import PostCard from "./posts/PostCard";

type PostsGridProps = {
  posts: DatabaseObjectResponse[];
};

export default function PostsGrid({ posts }: PostsGridProps) {
  return (
    <ul className="grid gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
    </ul>
  );
}
