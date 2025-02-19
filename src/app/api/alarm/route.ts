import { sendEamil } from "@/features/alarm/model";
import { z } from "zod";

const bodySchema = z.object({
  from: z.string(),
  subject: z.string(),
  message: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response("보내는이, 제목, 내용은 문자열만 가능합니다.", {
      status: 400,
    });
  }

  return sendEamil(body)
    .then(() => {
      return new Response(
        JSON.stringify({ message: "메일을 성공적으로 보냈음" }),
        {
          status: 200,
        }
      );
    })
    .catch((error) => {
      return new Response(
        JSON.stringify({ message: "메일 전송에 실패함", error }),
        {
          status: 500,
        }
      );
    });
}
