import type { EmailForm } from "../model";

export async function sendAlarmEmail(form: EmailForm) {
  const response = await fetch("/api/alarm", {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "알 수 없는 서버 에러");
  }

  return data;
}
