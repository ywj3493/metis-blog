import { Post } from "@/adapters/posts";
import PostsGrid from "./PostsGrid";
import { getNotionPosts } from "@/services/_external";

export default async function FeaturedPosts() {
  const dataList = await getNotionPosts();
  const posts = dataList.map(Post.create);
  return (
    <section className="p-24 w-full">
      <h2 className="text-2xl font-bold my-8 px-8">Featured Posts</h2>
      <PostsGrid posts={posts} />
    </section>
  );
}
