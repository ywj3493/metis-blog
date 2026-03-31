import { getNotionPage, getNotionPosts, getSlugMap } from "@/entities/post/api";
import { Post } from "@/entities/post/model";
import { isNotionPageId } from "@/entities/post/utils";
import { ClientNotionRenderer, PostNavigator } from "@/features/post/ui";
import { CACHE_CONFIG } from "@/shared/config";

type PostDetailPageProps = {
  params: { slug: string }; // postId 처럼 보이는 slug 또는 id
};

export const revalidate = CACHE_CONFIG.ISR_REVALIDATE_TIME;

// 모든 페이지에 대해 한번만 호출됨
export async function generateStaticParams() {
  const posts = (await getNotionPosts()).map(Post.create);

  return posts.map(({ slugifiedTitle }) => ({
    slug: slugifiedTitle,
  }));
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
    console.error(
      `Post not found for given slug or id. Slug: ${slugOrId}, Id: ${postId}, SlugMap: ${JSON.stringify(slugMap)}`,
    );
    throw new Error("Post not found for given slug or id.");
  }

  return postId;
}
