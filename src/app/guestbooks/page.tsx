import { GuestbookList } from "@/features/guestbooks/ui";
import { Contact } from "@/features/profile/ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "contact",
  description: "메티에게 방명록 남기기",
};

export default async function GuestbooksPage() {
  return (
    <section className="flex flex-col items-center ">
      <Contact />
      <GuestbookList />
    </section>
  );
}
