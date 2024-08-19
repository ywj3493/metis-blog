import { getNotionGuestbooks, postNotionGuestbook } from "@/services/_external";
import * as yup from "yup";

const bodySchema = yup.object().shape({
  name: yup.string().required("이름은 필수입니다."),
  content: yup.string().required("내용은 필수입니다."),
  isPrivate: yup.boolean().required(),
});

export async function GET() {
  return getNotionGuestbooks()
    .then((response) => {
      return new Response(
        JSON.stringify({
          message: "게스트북을 성공적으로 가져왔습니다.",
          data: response,
        }),
        {
          status: 200,
        }
      );
    })
    .catch((error) => {
      return new Response(
        JSON.stringify({ message: "게스트북 가져오기에 실패했습니다.", error }),
        {
          status: 500,
        }
      );
    });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!bodySchema.isValidSync(body)) {
    return new Response("이름, 내용을 입력 해주세요.", {
      status: 400,
    });
  }

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
    .catch((error) => {
      return new Response(
        JSON.stringify({ message: "게스트북 생성에 실패했습니다.", error }),
        {
          status: 500,
        }
      );
    });
}
