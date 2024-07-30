import FilterablePosts from "@/components/posts/FilterablePosts";
import {
  getNotionPostDatabaseTags,
  getNotionPosts,
} from "@/services/_external/notion";
import { Metadata } from "next";

export const revalidate = 180;

export const metadata: Metadata = {
  title: "posts",
  description: "메티의 포스트",
};

export default async function PostListPage() {
  const dataList = await getNotionPosts();
  const tagDataList = await getNotionPostDatabaseTags();

  return <FilterablePosts tagDataList={tagDataList} dataList={dataList} />;
}
