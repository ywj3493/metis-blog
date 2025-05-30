"use client";

import { Post, Tag } from "@/entities/posts/model";
import type { TagDatabaseResponse } from "@/entities/posts/model/type";
import { EmptyPosts } from "@/entities/posts/ui";
import { TagFilter } from "@/features/tags/ui";
import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { useState } from "react";
import { PostsGrid } from "./posts-grid";

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

  const activeTags = tags.filter((tag) =>
    posts.some((post) => post.tags.some(({ id }) => id === tag.id)),
  );

  const filteredPosts =
    selectedTags.size === 0
      ? posts
      : posts.filter((post) =>
          post.tags.some(({ id }) => selectedTags.has(id)),
        );

  const isFilteredPostsEmpty = filteredPosts.length === 0;

  return (
    <div className="my-8 flex w-full justify-center gap-4 px-4">
      <TagFilter
        tags={activeTags}
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
