import PostCard, { PostCardSkeleton } from "@/components/posts/PostCard";
import { getDatabaseTags, getPosts } from "@/api/notion";
import { Suspense } from "react";
import PostsGrid from "@/components/PostsGrid";
import LNB from "@/components/LNB";
import FilterablePosts from "@/components/posts/FilterablePosts";

export const revalidate = 86400;

export default async function PostListPage() {
  const posts = await getPosts();
  const tags = await getDatabaseTags();

  return <FilterablePosts tags={tags} posts={posts} />;
}
