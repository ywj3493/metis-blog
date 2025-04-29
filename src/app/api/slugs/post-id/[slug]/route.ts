import { getSlugMap } from "@/entities/posts/cache/slug-cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  const slugMap = await getSlugMap();

  if (!slugMap) {
    return NextResponse.json({ error: "Slug map not found" }, { status: 404 });
  }

  const slugToPostIdMap = Object.entries(slugMap).reduce(
    (acc, [postId, slugValue]) => {
      acc[slugValue] = postId;
      return acc;
    },
    {} as Record<string, string>,
  );

  const postId = slugToPostIdMap[slug];

  if (!postId) {
    return NextResponse.json({ error: "Slug not found" }, { status: 404 });
  }

  return NextResponse.json({ postId });
}
