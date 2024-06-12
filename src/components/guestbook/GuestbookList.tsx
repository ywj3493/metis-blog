"use client";

import { useEffect, useState } from "react";
import GuestbookCard from "./GuestbookCard";
import GuestbookForm from "./GuestbookForm";
import { getGuestbooks } from "@/services/guestbooks";
import { LoadingSpinner } from "../Loading";

export default function GuestbookList() {
  const [guestbooks, setGuestbooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGuestbooks = async () => {
    setIsLoading(true);
    try {
      const res = await getGuestbooks();
      setGuestbooks(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestbooks();
  }, []);

  return (
    <div className="flex flex-col gap-12 items-center">
      <GuestbookForm refetch={fetchGuestbooks} />
      {isLoading && <LoadingSpinner />}
      {guestbooks.map((guestbook: any) => (
        <GuestbookCard key={guestbook.id} guestbook={guestbook} />
      ))}
    </div>
  );
}
