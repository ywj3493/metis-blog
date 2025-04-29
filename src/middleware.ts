import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // /posts/[slug or id] 형태만 처리
  const match = pathname.match(/^\/posts\/([^/]+)/);
  if (!match) return NextResponse.next();

  const param = match[1];

  // middleware는 fetch 외 사용 불가: 별도 API 호출
  const slugMapRes = await fetch(`${origin}/api/slugs`);
  if (!slugMapRes.ok) {
    return NextResponse.rewrite(new URL("/500", request.url)); // 예외 처리
  }

  const slugMap: Record<string, string> = await slugMapRes.json();

  // param이 postId → slug로 리디렉션
  if (slugMap[param]) {
    const slug = slugMap[param];
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/posts/${slug}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // param이 slug → 해당 slug에 대응하는 postId가 있는지 검사
  const postId = Object.entries(slugMap).find(
    ([, slug]) => slug === param,
  )?.[0];
  if (postId) {
    return NextResponse.next();
  }

  // 둘 다 아니라면 404로 리라이트
  return NextResponse.rewrite(new URL("/404", request.url));
}

export const config = {
  matcher: ["/posts/:path*"],
};
