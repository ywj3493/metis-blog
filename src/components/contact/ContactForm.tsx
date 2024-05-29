"use client";

import { useState } from "react";
import Banner, { BannerData } from "./Banner";
import { sendContactEmail } from "@/services/contact";
import { useForm } from "react-hook-form";

type Form = {
  from: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const { register, reset, handleSubmit } = useForm<Form>();

  const [bannerData, setBannerData] = useState<BannerData | null>();
  const [isSending, setIsSending] = useState(false);

  const handleSendContactEmail = (formData: Form) => {
    setIsSending(true);
    sendContactEmail(formData)
      .then(() => {
        setBannerData({ message: "감사합니다.", state: "success" });
        reset();
      })
      .catch((e) => {
        setBannerData({
          message: `전송에 실패했습니다. 사유 : ${e.message}`,
          state: "error",
        });
      })
      .finally(() => {
        setIsSending(false);
        setTimeout(() => {
          setBannerData(null);
        }, 2000);
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSendContactEmail)}
        className="w-full max-w-md flex flex-col gap-8 m-8 p-8 bg-slate-400 rounded-lg"
      >
        <label htmlFor="from" className="font-semibold">
          보내는 사람
        </label>
        <input
          {...register("from")}
          type="email"
          id="from"
          name="from"
          required
          autoFocus
          placeholder="example@gmail.com"
        />
        <label htmlFor="subject" className="font-semibold">
          제목
        </label>
        <input {...register("subject")} id="subject" name="subject" required />
        <label htmlFor="message" className="font-semibold">
          내용
        </label>
        <textarea
          rows={10}
          {...register("message")}
          id="message"
          name="message"
        />
        {isSending ? (
          <p className="bg-gray-500 text-white text-center">전송중...</p>
        ) : (
          <button
            type="submit"
            className="bg-blue text-white font-bold"
            disabled={isSending}
          >
            보내기
          </button>
        )}
      </form>
      {bannerData && <Banner banner={bannerData} />}
    </>
  );
}
