import { getNotionPosts } from "@/entities/post/api";
import { Post } from "@/entities/post/model";
import { PostsGrid } from "./posts-grid";

export async function FeaturedPosts() {
  const posts = (await getNotionPosts()).map(Post.create);

  return (
    <section className="w-full p-8">
      <PostsGrid posts={posts} />
    </section>
  );
}
