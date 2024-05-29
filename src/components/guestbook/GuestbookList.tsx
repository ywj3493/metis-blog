"use client";

import { useEffect, useState } from "react";
import GuestbookCard from "./GuestbookCard";
import GuestbookForm from "./GuestbookForm";
import { getGuestbooks } from "@/services/guestbooks";

export default function GuestbookList() {
  const [guestbooks, setGuestbooks] = useState([]);

  const fetchGuestbooks = async () => {
    try {
      const res = await getGuestbooks();
      setGuestbooks(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchGuestbooks();
  }, []);

  return (
    <>
      <GuestbookForm refetch={fetchGuestbooks} />
      {guestbooks.map((guestbook: any) => (
        <GuestbookCard key={guestbook.id} guestbook={guestbook} />
      ))}
    </>
  );
}
