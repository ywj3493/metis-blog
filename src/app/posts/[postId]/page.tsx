import { getPage } from "@/api/notion";
import ClientNotionRenderer from "@/components/posts/ClientNotionRenderer";

type PostDetailPageProps = {
  params: { postId: string };
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const pageRecordMap = await getPage(params.postId);

  return <ClientNotionRenderer recordMap={pageRecordMap} />;
}
