import {
  GuestbookDatabaseResponse,
  GuestbookFormData,
} from "@/entities/guestbooks/model/type";

export async function createGuestbook(guestForm: GuestbookFormData) {
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

export async function getGuestbooks() {
  const response = await fetch("/api/guestbooks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { data } = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "알 수 없는 서버 에러");
  }

  return data as GuestbookDatabaseResponse[];
}
