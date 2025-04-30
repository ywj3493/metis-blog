import { getNotionPosts } from "@/features/notion/model";
import { Post } from "@/features/posts/model";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await getNotionPosts();

  const slugMap = posts.map(Post.create).reduce(
    (acc, { id, slugifiedTitle }) => {
      acc[id] = encodeURIComponent(slugifiedTitle); // Encode the slugified title
      return acc;
    },
    {} as Record<string, string>,
  );

  return NextResponse.json(slugMap);
}
