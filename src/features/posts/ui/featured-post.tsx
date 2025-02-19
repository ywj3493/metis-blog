import { getNotionPosts } from "@/features/notion/model";
import { PostsGrid } from "./posts-grid";
import { Post } from "../model";

export async function FeaturedPosts() {
  const dataList = await getNotionPosts();
  const posts = dataList.map(Post.create);
  return (
    <section className="p-24 w-full">
      <PostsGrid posts={posts} />
    </section>
  );
}
