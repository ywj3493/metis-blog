"use client";

import { useEffect, useState } from "react";
import GuestbookCard from "./GuestbookCard";
import GuestbookForm from "./GuestbookForm";
import { getGuestbooks } from "@/services/guestbooks";
import { Guestbook } from "@/adapters/guestbooks";
import { LoadingSpinner } from "../common/Loading";

export default function GuestbookList() {
  const [guestbooks, setGuestbooks] = useState<Guestbook[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGuestbooks = async () => {
    setIsLoading(true);
    try {
      const res = await getGuestbooks();

      const guestbooks = res.map(Guestbook.create);

      setGuestbooks(guestbooks);
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
      {guestbooks?.map((guestbook) => (
        <GuestbookCard key={guestbook.id} guestbook={guestbook} />
      ))}
    </div>
  );
}
