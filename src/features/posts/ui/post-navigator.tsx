import { SmallPostCard } from "@/entities/posts/ui";
import { getNotionPosts } from "@/features/notion/model";
import { Tooltip } from "@/shared/ui";
import { Post } from "../model";

type PostNavigatorProps = {
  id: string;
};

export async function PostNavigator({ id }: PostNavigatorProps) {
  const postDataList = await getNotionPosts();

  const posts = postDataList.map(Post.create);
  const currentPost = posts.find((post) => id === post.id);
  const currentIndex = posts.findIndex((post) => id === post.id);

  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const prevPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  if (!currentPost) throw Error("게시글 관련 문제가 생겼습니다.");

  const { tags } = currentPost;

  const tagFilter = new Set(tags.map(({ id }) => id));

  const filteredPosts = posts
    .filter((post) => id !== post.id)
    .filter((post) => post.tags.some(({ id }) => tagFilter.has(id)));

  return (
    <div className="pb-40 flex flex-col justify-center items-center">
      <div className="pb-40 grid sm:grid-cols-1 md:grid-cols-2 gap-30">
        <div className="w-340 flex items-center text-center justify-center text-gray-400">
          {nextPost ? (
            <div className="flex flex-col text-black items-center">
              <p className="border-b-2 border-blue-400 border-solid mb-2 w-fit">
                다음 포스트
              </p>
              <SmallPostCard post={nextPost} />
            </div>
          ) : (
            "다음 글이 없습니다."
          )}
        </div>
        <div className="w-340 flex items-center text-center justify-center text-gray-400">
          {prevPost ? (
            <div className="flex flex-col text-black items-center">
              <p className="border-b-2 border-blue-400 border-solid mb-2 w-fit">
                이전 포스트
              </p>
              <SmallPostCard post={prevPost} />
            </div>
          ) : (
            "이전 글이 없습니다."
          )}
        </div>
      </div>
      <div className="mt-20 flex flex-col text-black items-center">
        <Tooltip message="보고있는 게시물과 같은 태그를 가진 포스트 입니다.">
          <p className="border-b-2 border-blue-400 border-solid mb-2 w-fit">
            연관 포스트
          </p>
        </Tooltip>
        <div className="grid gap-30 sm:grid-cols-1 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <SmallPostCard key={`navigators_${post.id}`} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
