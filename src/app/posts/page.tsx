import FilterablePosts from "@/components/posts/FilterablePosts";
import { getDatabaseTags, getPosts } from "@/services/notion";

export const revalidate = 180;

export default async function PostListPage() {
  const posts = await getPosts();
  const tags = await getDatabaseTags();

  return <FilterablePosts tags={tags} posts={posts} />;
}
