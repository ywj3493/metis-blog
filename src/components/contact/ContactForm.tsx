"use client";

import { FormEvent, useRef, useState } from "react";
import Banner, { BannerData } from "./Banner";
import { sendContactEmail } from "@/services/contact";

type Form = {
  from: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const fromInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const [bannerData, setBannerData] = useState<BannerData | null>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      from: fromInputRef.current?.value as string,
      subject: subjectInputRef.current?.value as string,
      message: messageInputRef.current?.value as string,
    };
    sendContactEmail(formData)
      .then(() => {
        setBannerData({ message: "감사합니다.", state: "success" });
        fromInputRef.current?.value === "";
        subjectInputRef.current?.value === "";
        messageInputRef.current?.value === "";
      })
      .catch((e) => {
        setBannerData({
          message: `전송에 실패했습니다. 사유 : ${e.message}`,
          state: "error",
        });
      })
      .finally(() => {
        setTimeout(() => {
          setBannerData(null);
        }, 2000);
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-8 m-8 p-8 bg-slate-400 rounded-lg"
      >
        <label htmlFor="from" className="font-semibold">
          보내는 사람
        </label>
        <input
          ref={fromInputRef}
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
        <input ref={subjectInputRef} id="subject" name="subject" required />
        <label htmlFor="message" className="font-semibold">
          내용
        </label>
        <textarea rows={10} ref={messageInputRef} id="message" name="message" />
        <button type="submit" className="bg-blue text-white font-bold">
          보내기
        </button>
      </form>
      {bannerData && <Banner banner={bannerData} />}
    </>
  );
}
