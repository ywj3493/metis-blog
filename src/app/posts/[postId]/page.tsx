import ClientNotionRenderer from "@/components/posts/ClientNotionRenderer";
import { getPage, getPostMetadata } from "@/services/notion";

type PostDetailPageProps = {
  params: { postId: string };
};

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { title } = await getPostMetadata(params.postId);

  return {
    title,
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const pageRecordMap = await getPage(params.postId);

  return <ClientNotionRenderer recordMap={pageRecordMap} />;
}
