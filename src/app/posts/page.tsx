import FilterablePosts from "@/components/posts/FilterablePosts";
import { getDatabaseTags, getPosts } from "@/services/notion";
import { Metadata } from "next";

export const revalidate = 180;

export const metadata: Metadata = {
  title: "posts",
  description: "메티의 포스트",
};

export default async function PostListPage() {
  const posts = await getPosts();
  const tags = await getDatabaseTags();

  return <FilterablePosts tags={tags} posts={posts} />;
}
