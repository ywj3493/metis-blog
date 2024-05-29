"use client";

import { Guestbook } from "@/services/_external/notion";
import { createGuestbook } from "@/services/guestbooks";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function GuestbookForm({
  refetch,
}: {
  refetch: () => Promise<any>;
}) {
  const { register, reset, handleSubmit } = useForm<Guestbook>();

  const [isPostLoading, setIsPostLoading] = useState(false);

  const handleBuildForm = ({ name, content }: Guestbook) => {
    setIsPostLoading(true);
    createGuestbook({ name, content, status: "공개" })
      .then(() => {
        setIsPostLoading(false);
        reset();
        refetch();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <form onSubmit={handleSubmit(handleBuildForm)}>
      <input type="text" {...register("name")} placeholder="이름" />
      <textarea placeholder="내용" {...register("content")} />

      {isPostLoading ? (
        <div>전송 중...</div>
      ) : (
        <button type="submit">전송</button>
      )}
    </form>
  );
}
