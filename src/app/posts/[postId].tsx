import { getPage } from "@/notion/notion";
import { ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "react-notion-x";

type PostDetailPageProps = {
  params: { postId: string };
};

export const revalidate = 86400;

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const page = await getPage(params.postId);

  return <div>{page}</div>;
}
