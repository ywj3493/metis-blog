import { postNotionGuestbook } from "@/services/_external/notion";

export async function POST(request: Request) {
  const body = await request.json();

  return postNotionGuestbook(body)
    .then((response) => {
      return new Response(
        JSON.stringify({
          message: "게스트북을 성공적으로 생성했습니다.",
          data: response,
        }),
        {
          status: 200,
        }
      );
    })
    .catch((e) => {
      console.log(e);
      return new Response(
        JSON.stringify({ message: "게스트북 생성에 실패했습니다." }),
        {
          status: 500,
        }
      );
    });
}
