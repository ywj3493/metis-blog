import {
  getNotionPostDatabaseTags,
  getNotionPosts,
} from "@/features/notion/model";
import { FilterablePosts } from "@/features/posts/ui";
import type { Metadata } from "next";

export const revalidate = 180;

export const metadata: Metadata = {
  title: "posts",
  description: "메티의 포스트",
};

export default async function PostListPage() {
  const dataList = await getNotionPosts();
  const tagDataList = await getNotionPostDatabaseTags();

  return (
    <section>
      <FilterablePosts tagDataList={tagDataList} dataList={dataList} />
    </section>
  );
}
