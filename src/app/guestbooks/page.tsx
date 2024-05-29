import GuestbookCard from "@/components/guestbook/GuestbookCard";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import { getNotionGuestbooks } from "@/services/_external/notion";

export default async function GuestbooksPage() {
  const guestbooks = await getNotionGuestbooks();
  return (
    <>
      <GuestbookForm />
      {guestbooks.map((guestbook) => (
        <GuestbookCard key={guestbook.id} guestbook={guestbook} />
      ))}
    </>
  );
}
