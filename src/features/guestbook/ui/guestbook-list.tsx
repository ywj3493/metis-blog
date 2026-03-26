"use client";

import { useCallback, useEffect, useState } from "react";
import { Guestbook } from "@/entities/guestbook/model";
import { LoadingSpinner } from "@/shared/ui";
import { getGuestbooks } from "../api";
import { GuestbookCard } from "./guestbook-card";
import { GuestbookForm } from "./guestbook-form";

export function GuestbookList() {
  const [guestbooks, setGuestbooks] = useState<Guestbook[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGuestbooks = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchGuestbooks();
  }, [fetchGuestbooks]);

  return (
    <div className="flex flex-col items-center gap-3">
      <GuestbookForm refetch={fetchGuestbooks} />
      {isLoading && <LoadingSpinner />}
      {guestbooks?.map((guestbook) => (
        <GuestbookCard key={guestbook.id} guestbook={guestbook} />
      ))}
    </div>
  );
}
