"use client";

import LNB from "../LNB";
import PostsGrid from "../PostsGrid";
import { useState } from "react";
import EmptyPosts from "./EmptyPosts";
import { Post, Tag } from "@/adapters/posts";
import { TagDatabaseResponse } from "@/adapters/posts/type";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type FilterablePostsProps = {
  tagDataList: TagDatabaseResponse[];
  dataList: DatabaseObjectResponse[];
};

export default function FilterablePosts({
  tagDataList,
  dataList,
}: FilterablePostsProps) {
  const [selectedTags, setSelectedTags] = useState(new Set<string>());

  const tags = tagDataList.map(Tag.create);
  const posts = dataList.map(Post.create);

  const filteredPosts =
    selectedTags.size === 0
      ? posts
      : posts.filter((post) =>
          post.tags.some(({ id }) => selectedTags.has(id))
        );

  const isFilteredPostsEmpty = filteredPosts.length === 0;

  return (
    <div className="flex my-24 w-full justify-center">
      <LNB
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
      {isFilteredPostsEmpty ? (
        <EmptyPosts />
      ) : (
        <PostsGrid posts={filteredPosts} />
      )}
    </div>
  );
}
