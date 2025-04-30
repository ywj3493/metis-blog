import { Post } from "@/entities/posts/model";
import { getNotionPosts } from "@/features/notion/model";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = (await getNotionPosts()).map(Post.create);

  const slugMap = posts.reduce(
    (acc, { id, slugifiedTitle }) => {
      acc[slugifiedTitle] = id;
      return acc;
    },
    {} as Record<string, string>,
  );

  return NextResponse.json(slugMap);
}
