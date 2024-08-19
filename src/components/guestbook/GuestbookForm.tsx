"use client";

import { createGuestbook } from "@/services/guestbooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { sendAlarmEmail } from "@/services/alarm";
import { GuestbookFormData } from "@/adapters/guestbooks/type";
import { LoadingSpinner } from "../common/Loading";

export default function GuestbookForm({
  refetch,
}: {
  refetch: () => Promise<any>;
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

  const handleBuildForm = ({ name, content, isPrivate }: GuestbookFormData) => {
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
      <h2 className="text-xl font-bold">방명록을 남겨주세요.</h2>
      <form
        onSubmit={handleSubmit(handleBuildForm)}
        className="flex flex-col w-320 p-8 gap-12 border-1 rounded-8 "
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
              type="checkbox"
              {...register("isPrivate")}
              className="mr-4"
            />
            <label>비공개</label>
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
            className="bg-blue-200 rounded-4 text-white disabled:bg-gray-300 disabled:cursor-not-allowed p-2 text-center"
            disabled={!isValid}
          >
            전송
          </button>
        )}
      </form>
    </>
  );
}
