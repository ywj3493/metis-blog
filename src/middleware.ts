import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isNotionPageId } from "./entities/posts/utils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/posts\/([^/]+)/);
  if (!match) return NextResponse.next();

  const param = match[1];

  if (isNotionPageId(param)) {
    // ✅ 환경에 따라 절대 URL 안전하게 구성
    const isLocal = request.headers.get("host")?.startsWith("localhost");
    const slugMapUrl = isLocal
      ? "http://localhost:3000/slug-map-helper.json"
      : `${request.nextUrl.origin}/slug-map-helper.json`;

    const slugMapRes = await fetch(slugMapUrl, {
      next: { revalidate: 180 },
    });

    if (!slugMapRes.ok) {
      console.error(
        `[Middleware] Slug map fetch failed with ${slugMapRes.status}`,
      );
      return NextResponse.rewrite(new URL("/500", request.url));
    }

    const slugMap: Record<string, string> = await slugMapRes.json();
    const reverseSlugMap = Object.fromEntries(
      Object.entries(slugMap).map(([slug, id]) => [id, slug]),
    );

    const slug = reverseSlugMap[param];
    if (slug) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/posts/${slug}`;
      console.log(`[Middleware] Redirecting postId ${param} → /posts/${slug}`);
      return NextResponse.redirect(redirectUrl, 301);
    }

    return NextResponse.rewrite(new URL("/404", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:path*"],
};
