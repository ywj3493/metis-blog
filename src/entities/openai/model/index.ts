// lib/summarize.ts
import OpenAI from "openai";
import { modelConfig } from "../config";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** 긴 본문을 안전하게 자르고 요약 */
function safeSlice(text: string, tokenLikeLimit = 8000) {
  // 아주 러프하게 토큰 근사치로 자름(공백 기준)
  const words = text.split(/\s+/);
  return words.slice(0, tokenLikeLimit).join(" ");
}

const system = {
  role: "system",
  content:
    "블로그 글이 어떤 내용을 담고 있는지 2문장 이내로 간단히 알려주는 역할. 과장/추측 금지. 부가설명 금지. 마크다운 표현 금지.",
};

async function _getAISummary(postTitle: string, plainText: string) {
  const content = safeSlice(plainText, 8000);
  const prompt = [`제목: ${postTitle}`, "본문:", content].join("\n");

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: system.content },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}

async function _getAISummaryLocal(postTitle: string, plain_text: string) {
  const content = safeSlice(plain_text, 8000);

  const user = {
    role: "user",
    content: [`제목: ${postTitle}`, "본문:", content].join("\n"),
  };

  const response = await fetch(`${process.env.LOCAL_AI_ENDPOINT}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [system, user],
      stream: false,
      ...modelConfig.local,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch summary from local AI");
  }

  const data = await response.json();

  return data.message?.content;
}

export const getAISummary =
  process.env.NODE_ENV === "development" ? _getAISummaryLocal : _getAISummary;
