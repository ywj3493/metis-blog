import { slugify } from "@/entities/posts/utils";
import { getNotionPosts } from "@/features/notion/model";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await getNotionPosts();

  const slugMap = posts.reduce(
    (acc, post) => {
      acc[post.id] = encodeURIComponent(
        /* @ts-expect-error Notion Type Error */
        slugify(post.properties.제목.title[0].plain_text),
      );
      return acc;
    },
    {} as Record<string, string>,
  );

  return NextResponse.json(slugMap);
}
