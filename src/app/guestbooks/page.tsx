import GuestbookList from "@/components/guestbook/GuestbookList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "contact",
  description: "메티에게 메일 보내기",
};

export default async function GuestbooksPage() {
  return (
    <section className="flex flex-col items-center ">
      <GuestbookList />
    </section>
  );
}
