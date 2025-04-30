import { Post } from "@/entities/posts/model";
import { getNotionPosts } from "@/features/notion/model";
import { cache } from "react";

export const getSlugMap = cache(async () => {
  const posts = (await getNotionPosts()).map(Post.create);

  const slugMap = posts.reduce(
    (acc, { id, slugifiedTitle }) => {
      acc[slugifiedTitle] = id;
      return acc;
    },
    {} as Record<string, string>,
  );

  return slugMap;
});
