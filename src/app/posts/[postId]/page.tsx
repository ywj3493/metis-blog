import { ClientNotionRenderer } from "@/entities/posts/ui";
import {
  getNotionPage,
  getNotionPostMetadata,
  getNotionPosts,
} from "@/features/notion/model";
import { PostNavigator } from "@/features/posts/ui";

export const revalidate = 180;

type PostDetailPageProps = {
  params: { postId: string };
};

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { title, content, tags } = await getNotionPostMetadata(params.postId);

  return {
    title,
    description: content,
    keywords: tags,
  };
}

export async function generateStaticParams() {
  const posts = await getNotionPosts();

  return posts.map((post) => ({
    postId: post.id,
  }));
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const pageRecordMap = await getNotionPage(params.postId);

  return (
    <>
      <ClientNotionRenderer recordMap={pageRecordMap} />
      {/* @ts-expect-error Server Component */}
      <PostNavigator id={params.postId} />
    </>
  );
}
