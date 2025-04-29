import { getSlugMap } from "@/entities/posts/cache/slug-cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { postId: string } },
) {
  const { postId } = params;

  const slugMap = await getSlugMap();

  if (!slugMap) {
    return NextResponse.json({ error: "Slug map not found" }, { status: 404 });
  }

  const slug = slugMap[postId];

  if (!slug) {
    return NextResponse.json({ error: "PostId not found" }, { status: 404 });
  }

  return NextResponse.json({ slug });
}
