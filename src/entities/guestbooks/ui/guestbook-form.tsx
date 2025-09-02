"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { GuestbookFormData } from "@/entities/guestbooks/model/type";
import { sendAlarmEmail } from "@/features/alarm/api";
import { createGuestbook } from "@/features/guestbooks/api";
import { LoadingSpinner } from "@/shared/ui";

export function GuestbookForm({
  refetch,
}: {
  refetch: () => Promise<unknown>;
}) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<GuestbookFormData>({
    defaultValues: {
      name: "",
      content: "",
      isPrivate: false,
    },
  });

  const [isPostLoading, setIsPostLoading] = useState(false);

  const buildForm = ({ name, content, isPrivate }: GuestbookFormData) => {
    setIsPostLoading(true);
    createGuestbook({ name, content, isPrivate })
      .then(() => {
        setIsPostLoading(false);
        reset();
        sendAlarmEmail({
          from: name,
          subject: "방명록",
          message: content,
        });
        refetch();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <h2 className="font-bold text-xl">방명록을 남겨주세요.</h2>
      <form
        onSubmit={handleSubmit(buildForm)}
        className="flex w-80 flex-col gap-3 rounded border p-2"
      >
        <div className="flex justify-between">
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="이름"
            maxLength={10}
          />
          <span>
            <input
              id="isPrivate"
              type="checkbox"
              {...register("isPrivate")}
              className="mr-1"
            />
            <label htmlFor="isPrivate">비공개</label>
          </span>
        </div>
        <textarea
          placeholder="내용"
          {...register("content", { required: true })}
          rows={3}
        />
        {isPostLoading ? (
          <LoadingSpinner />
        ) : (
          <button
            type="submit"
            className="rounded bg-blue-200 p-0.5 text-center text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            disabled={!isValid}
          >
            전송
          </button>
        )}
      </form>
    </>
  );
}
