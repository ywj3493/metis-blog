import { Post } from "@/adapters/posts";
import PostsGrid from "./PostsGrid";
import { getNotionPosts } from "@/services/_external";

export default async function FeaturedPosts() {
  const dataList = await getNotionPosts();
  const posts = dataList.map(Post.create);
  return (
    <section className="p-24 w-full">
      <PostsGrid posts={posts} />
    </section>
  );
}
