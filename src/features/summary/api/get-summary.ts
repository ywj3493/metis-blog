import { getOpenAIClient } from "@/shared/api";
import { SUMMARY_MODEL_CONFIG } from "@/shared/config";

const SYSTEM_PROMPT =
	"블로그 글이 어떤 내용을 담고 있는지 2문장 이내로 간단히 알려주는 역할. 과장/추측 금지. 부가설명 금지. 마크다운 표현 금지. 정중한 표현 사용.";

function safeSlice(text: string, tokenLikeLimit = 8000): string {
	const words = text.split(/\s+/);
	return words.slice(0, tokenLikeLimit).join(" ");
}

export async function getSummary(
	postTitle: string,
	plainText: string,
): Promise<string> {
	const content = safeSlice(plainText, 8000);
	const prompt = [`제목: ${postTitle}`, "본문:", content].join("\n");

	const res = await getOpenAIClient().chat.completions.create({
		...SUMMARY_MODEL_CONFIG,
		messages: [
			{ role: "system", content: SYSTEM_PROMPT },
			{ role: "user", content: prompt },
		],
	});

	return res.choices[0]?.message?.content?.trim() ?? "";
}
