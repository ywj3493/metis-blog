import ClientNotionRenderer from "@/components/posts/ClientNotionRenderer";
import { getPage } from "@/services/notion";

type PostDetailPageProps = {
  params: { postId: string };
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const pageRecordMap = await getPage(params.postId);

  return <ClientNotionRenderer recordMap={pageRecordMap} />;
}
