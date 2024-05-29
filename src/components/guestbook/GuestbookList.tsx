"use client";

import { useEffect, useState } from "react";
import GuestbookCard from "./GuestbookCard";
import GuestbookForm from "./GuestbookForm";
import Loading from "../Loading";
import { getGuestbooks } from "@/services/guestbooks";

export default function GuestbookList() {
  const [guestbooks, setGuestbooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGuestbooks = async () => {
    setIsLoading(true);
    try {
      const res = await getGuestbooks();
      setGuestbooks(res);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
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
