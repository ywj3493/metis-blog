import ClientNotionRenderer from "@/components/posts/ClientNotionRenderer";
import {
  getNotionPage,
  getNotionPostMetadata,
  getNotionPosts,
} from "@/services/_external/notion";

type PostDetailPageProps = {
  params: { postId: string };
};

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { title } = await getNotionPostMetadata(params.postId);

  return {
    title,
    description: title,
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const pageRecordMap = await getNotionPage(params.postId);

  return <ClientNotionRenderer recordMap={pageRecordMap} />;
}

// TODO: 다시 알아보기
export async function generateStaticParams() {
  const posts = await getNotionPosts();

  return posts.map((post) => {
    postId: post.id;
  });
}
