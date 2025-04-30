import { getNotionPosts } from "@/features/notion/model";
import { Post } from "../model";
import { PostsGrid } from "./posts-grid";

export async function FeaturedPosts() {
  const posts = (await getNotionPosts()).map(Post.create);

  return (
    <section className="w-full p-24">
      <PostsGrid posts={posts} />
    </section>
  );
}
