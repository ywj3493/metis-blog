import ClientNotionRenderer from "@/components/posts/ClientNotionRenderer";
import {
  getPage,
  getPostMetadata,
  getPosts,
} from "@/services/_external/notion";

type PostDetailPageProps = {
  params: { postId: string };
};

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { title } = await getPostMetadata(params.postId);

  return {
    title,
    description: title,
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const pageRecordMap = await getPage(params.postId);

  return <ClientNotionRenderer recordMap={pageRecordMap} />;
}

// TODO: 다시 알아보기
export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => {
    postId: post.id;
  });
}
