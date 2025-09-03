import { slug } from "github-slugger";
import { Post } from "@/entities/posts/model";
import { ClientNotionRenderer } from "@/entities/posts/ui";
import { isNotionPageId } from "@/entities/posts/utils";
import {
  getNotionPage,
  getNotionPostMetadata,
  getNotionPosts,
  getSlugMap,
} from "@/features/notion/model";
import { PostNavigator } from "@/features/posts/ui";
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
  const postId = await slugToPostId(params.slug);

  const { title, content, tags } = await getNotionPostMetadata(postId);

  return {
    title,
    description: content,
    keywords: tags,
    alternates: {
      canonical: `${process.env.BLOG_URL}/posts/${slug(title)}`,
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
