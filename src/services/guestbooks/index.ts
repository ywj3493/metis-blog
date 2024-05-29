import { Guestbook } from "../_external/notion";

export async function createGuestbook(guestForm: Guestbook) {
  const response = await fetch("/api/guestbooks", {
    method: "POST",
    body: JSON.stringify(guestForm),
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
