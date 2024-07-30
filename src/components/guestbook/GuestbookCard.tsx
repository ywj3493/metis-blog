import { Guestbook } from "@/adapters/guestbooks";

type GuestbookCardProps = {
  guestbook: Guestbook;
};

export default function GuestbookCard({ guestbook }: GuestbookCardProps) {
  const { isPublic, name, date, content } = guestbook;

  if (!isPublic) {
    return (
      <div className="flex border-1 rounded-8 w-320 p-8">
        비공개 방명록 입니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col p-8 border-1 rounded-8 w-320">
      <div className="flex justify-between">
        <h1>{name}</h1>
        <div className="text-sm">{date}</div>
      </div>
      <div>{content}</div>
    </div>
  );
}
