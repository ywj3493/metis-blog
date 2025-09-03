import { getNotionPosts } from "@/entities/notion/model";
import { Post } from "@/entities/posts/model";
import { PostsGrid } from "./posts-grid";

export async function FeaturedPosts() {
  const posts = (await getNotionPosts()).map(Post.create);

  return (
    <section className="w-full p-8">
      <PostsGrid posts={posts} />
    </section>
  );
}
