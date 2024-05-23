"use client";

import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import LNB, { Tag } from "../LNB";
import PostsGrid from "../PostsGrid";
import { useState } from "react";

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

  return (
    <div className="flex my-24">
      <LNB
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
      <PostsGrid posts={filteredPosts} />
    </div>
  );
}
