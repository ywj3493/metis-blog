import { type NextRequest, NextResponse } from "next/server";
import { patchPostSummary } from "@/features/posts/actions";

export async function PATCH(
  _: NextRequest,
  { params }: { params: { postId: string } },
) {
  const { postId } = params;

  try {
    const result = await patchPostSummary(postId);

    const response = new NextResponse(JSON.stringify(result), { status: 200 });
    return response;
  } catch (_e) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to update post summary" }),
      { status: 500 },
    );
  }
}
