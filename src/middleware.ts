import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isNotionPageId } from "./entities/posts/utils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/posts\/([^/]+)/);
  if (!match) return NextResponse.next();

  const param = match[1];

  if (isNotionPageId(param)) {
    const slugMapRes = await fetch(new URL("/api/slugs", request.url));
    if (!slugMapRes.ok) {
      return NextResponse.rewrite(new URL("/500", request.url));
    }

    const slugMap: Record<string, string> = await slugMapRes.json();
    const reverseSlugMap: Record<string, string> = Object.fromEntries(
      Object.entries(slugMap).map(([key, value]) => [value, key]),
    );

    // postId → 대응하는 slug로 redirect
    const slug = reverseSlugMap[param];
    console.log(slug, param, reverseSlugMap);
    if (slug) {
      console.log(`[Middleware] Redirecting to /posts/${slug}`);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/posts/${slug}`;
      return NextResponse.redirect(redirectUrl, 301);
    }
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:path*"],
};
