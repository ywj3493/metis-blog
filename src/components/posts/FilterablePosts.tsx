"use client";

import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import LNB, { Tag } from "../LNB";
import PostsGrid from "../PostsGrid";
import { useState } from "react";
import EmptyPosts from "./EmptyPosts";

type FilterablePostsProps = {
  tags: Tag[];
  posts: DatabaseObjectResponse[];
};

export default function FilterablePosts({ tags, posts }: FilterablePostsProps) {
  const [selectedTags, setSelectedTags] = useState(new Set<string>());

  const filteredPosts =
    selectedTags.size === 0
      ? posts
      : posts.filter((post) =>
          selectedTags.has((post as any).properties.Tags.multi_select[0].id)
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
