import { sendEamil } from "@/services/email";
import * as yup from "yup";

const bodySchema = yup.object().shape({
  from: yup.string().email().required(),
  subject: yup.string().required(),
  message: yup.string().required(),
});

export async function POST(request: Request) {
  const body = await request.json();
  if (!bodySchema.isValidSync(body)) {
    return new Response("보내는이, 제목, 내용은 문자열만 가능합니다.", {
      status: 400,
    });
  }
  return sendEamil(body)
    .then(
      () =>
        new Response(JSON.stringify({ message: "메일을 성공적으로 보냈음" }), {
          status: 200,
        })
    )
    .catch((e) => {
      console.log(e);
      new Response(JSON.stringify({ message: "메일 전송에 실패함" }), {
        status: 500,
      });
    });
}