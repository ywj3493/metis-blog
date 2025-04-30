// src/app/posts/[postId]/page.tsx

import { getSlugMap } from "@/entities/posts/cache/slug-cache";
import { ClientNotionRenderer } from "@/entities/posts/ui";
import { slugify } from "@/entities/posts/utils";
import {
  getNotionPage,
  getNotionPostMetadata,
  getNotionPosts,
} from "@/features/notion/model";
import { Post } from "@/features/posts/model";
import { PostNavigator } from "@/features/posts/ui";

type PostDetailPageProps = {
  params: { postId: string }; // postId 처럼 보이는 slug 또는 id
};

export const revalidate = 180;

export async function generateStaticParams() {
  const posts = await getNotionPosts();

  return posts.map(Post.create).map(({ slugifiedTitle }) => ({
    postId: slugifiedTitle,
  }));
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  const postId = await resolvePostId(params.postId);

  const { title, content, tags } = await getNotionPostMetadata(postId);

  return {
    title,
    description: content,
    keywords: tags,
    alternates: {
      canonical: `${process.env.BLOG_URL}/posts/${slugify(title)}`,
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const postId = await resolvePostId(params.postId);

  const pageRecordMap = await getNotionPage(postId);

  return (
    <>
      <ClientNotionRenderer recordMap={pageRecordMap} />
      <PostNavigator id={postId} />
    </>
  );
}

async function resolvePostId(slugOrId: string) {
  const slugMap = await getSlugMap();

  if (!slugMap) {
    throw new Error("Slug map not found");
  }

  if (slugMap[slugOrId]) {
    // slugOrId is a slug
    return slugOrId;
  }

  const postId = Object.keys(slugMap).find((id) => slugMap[id] === slugOrId);

  if (!postId) {
    console.error(
      `Post not found for given slug or id. Slug: ${slugOrId}, Id: ${postId}, SlugMap: ${JSON.stringify(slugMap)}`,
    );
    throw new Error("Post not found for given slug or id.");
  }

  return postId;
}
