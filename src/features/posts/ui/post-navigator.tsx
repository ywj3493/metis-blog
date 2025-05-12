import { Post } from "@/entities/posts/model";
import { SmallPostCard } from "@/entities/posts/ui";
import { getNotionPosts } from "@/features/notion/model";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

type PostNavigatorProps = {
  id: string;
};

export async function PostNavigator({ id }: PostNavigatorProps) {
  const posts = (await getNotionPosts()).map(Post.create);

  const currentPost = posts.find((post) => id === post.id);
  const currentIndex = posts.findIndex((post) => id === post.id);

  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const prevPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  if (!currentPost) throw Error("포스트을 불러올 수 없었습니다.");

  const { tags } = currentPost;

  const tagFilter = new Set(tags.map(({ id }) => id));

  const filteredPosts = posts
    .filter((post) => post.id !== currentPost.id)
    .filter((post) => post.tags.some(({ id }) => tagFilter.has(id)))
    // 날짜가 가까운 순으로 정렬
    .sort((prev, next) => {
      const currentPostDate = new Date(currentPost.publishTime);
      const prevPostDate = new Date(prev.publishTime);
      const nextPostDate = new Date(next.publishTime);

      const prevDiff = Math.abs(
        currentPostDate.getTime() - prevPostDate.getTime(),
      );
      const nextDiff = Math.abs(
        currentPostDate.getTime() - nextPostDate.getTime(),
      );

      return prevDiff - nextDiff;
    })
    .slice(0, 4)
    .sort((prev, next) => {
      const prevPostDate = new Date(prev.publishTime);
      const nextPostDate = new Date(next.publishTime);
      return nextPostDate.getTime() - prevPostDate.getTime();
    });

  return (
    <div className="flex flex-col items-center justify-center pb-10">
      <div className="grid gap-8 pb-10 sm:grid-cols-1 md:grid-cols-2">
        <div className="flex w-80 items-center justify-center text-center text-gray-400">
          {nextPost ? (
            <div className="flex flex-col items-center text-black">
              <p className="mb-0.5 w-fit border-blue-400 border-b-2 border-solid">
                다음 포스트
              </p>
              <SmallPostCard post={nextPost} />
            </div>
          ) : (
            "다음 글이 없습니다."
          )}
        </div>
        <div className="flex w-80 items-center justify-center text-center text-gray-400">
          {prevPost ? (
            <div className="flex flex-col items-center text-black">
              <p className="mb-0.5 w-fit border-blue-400 border-b-2 border-solid">
                이전 포스트
              </p>
              <SmallPostCard post={prevPost} />
            </div>
          ) : (
            "이전 글이 없습니다."
          )}
        </div>
      </div>
      <div className="mt-5 flex w-full flex-col items-center text-gray-400">
        {filteredPosts.length > 0 ? (
          <>
            <Tooltip>
              <TooltipTrigger>
                <p className="mb-2 w-fit border-blue-400 border-b-2 border-solid text-black">
                  연관 포스트
                </p>
              </TooltipTrigger>
              <TooltipContent>
                보고있는 포스트과 같은 태그를 가진 포스트 중 작성된 날짜와
                가까운 시일 내 작성된 포스트 입니다.
              </TooltipContent>
            </Tooltip>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
              {filteredPosts.map((post) => (
                <SmallPostCard key={`navigators_${post.id}`} post={post} />
              ))}
            </div>
          </>
        ) : (
          "연관 포스트가 없습니다."
        )}
      </div>
    </div>
  );
}
