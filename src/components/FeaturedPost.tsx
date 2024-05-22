import { getPosts } from "@/api/notion";
import PostsGrid from "./PostsGrid";

export default async function FeaturedPosts() {
  const posts = await getPosts();
  return (
    <section>
      <h2 className="text-2xl font-bold my-8">Featured Posts</h2>
      <PostsGrid posts={posts} />
    </section>
  );
}
