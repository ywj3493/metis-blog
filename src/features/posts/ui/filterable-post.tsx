"use client";

import { useState } from "react";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { TagFilter } from "@/features/tags/ui";
import { EmptyPosts } from "@/entities/posts/ui";
import { PostsGrid } from "./posts-grid";
import { TagDatabaseResponse } from "../model/type";
import { Post, Tag } from "../model";

type FilterablePostsProps = {
  tagDataList: TagDatabaseResponse[];
  dataList: DatabaseObjectResponse[];
};

export function FilterablePosts({
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
      <TagFilter
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
