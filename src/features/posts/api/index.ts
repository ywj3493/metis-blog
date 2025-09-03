export async function updatePostSummary(postId: string) {
  const response = await fetch(`/api/posts/${postId}/summary`, {
    method: "PATCH",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "블로그 포스트 요약 업데이트 실패");
  }

  return data;
}
