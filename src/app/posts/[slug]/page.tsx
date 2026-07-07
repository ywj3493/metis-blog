import { notFound } from "next/navigation";
import { getNotionPage, getNotionPosts, getSlugMap } from "@/entities/post/api";
import { Post } from "@/entities/post/model";
import { isNotionPageId } from "@/entities/post/utils";
import { ClientNotionRenderer, PostNavigator } from "@/features/post/ui";
import { CACHE_CONFIG } from "@/shared/config";

type PostDetailPageProps = {
  params: { slug: string }; // postId 처럼 보이는 slug 또는 id
};

export const revalidate = CACHE_CONFIG.ISR_REVALIDATE_TIME;

// 기본값이지만 명시 — false 로 바꾸면 사전 렌더링되지 않은 모든 포스트가 404가 된다.
export const dynamicParams = true;

// 빈 배열 반환: 빌드 시 포스트 페이지를 사전 렌더링하지 않는다 (온디맨드 ISR).
// 포스트마다 notionApi.getPage 가 여러 HTTP 요청으로 팬아웃되어, 전체 사전 렌더링 시
// Notion 이 요청을 차단해 빌드가 실패한다. 각 페이지는 첫 요청 시 생성 후 ISR 캐시된다.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  const posts = (await getNotionPosts()).map(Post.create);
  const post = posts.find(
    (p) => p.slugifiedTitle === decodeURIComponent(params.slug),
  );

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.aiSummary || `${post.title} - 블로그 포스트`,
    keywords: post.tags.map((t) => t.name),
    alternates: {
      canonical: `${process.env.BLOG_URL}/posts/${post.slugifiedTitle}`,
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const postId = await slugToPostId(params.slug);

  const pageRecordMap = await getNotionPage(postId);

  return (
    <>
      <ClientNotionRenderer recordMap={pageRecordMap} />
      <PostNavigator id={postId} />
    </>
  );
}

async function slugToPostId(slugOrId: string) {
  if (isNotionPageId(slugOrId)) {
    return slugOrId;
  }

  const slugMap = await getSlugMap();

  if (!slugMap) {
    throw new Error("Slug map not found");
  }

  const postId = slugMap[decodeURIComponent(slugOrId)];

  if (!postId) {
    notFound();
  }

  return postId;
}
