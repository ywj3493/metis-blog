import type { Guestbook } from "../model";

type GuestbookCardProps = {
  guestbook: Guestbook;
};

export function GuestbookCard({ guestbook }: GuestbookCardProps) {
  const { isPublic, name, date, content } = guestbook;

  if (!isPublic) {
    return (
      <div className="flex w-320 rounded-8 border-1 p-8">
        비공개 방명록 입니다.
      </div>
    );
  }

  return (
    <div className="flex w-320 flex-col rounded-8 border-1 p-8">
      <div className="flex justify-between">
        <h1>{name}</h1>
        <div className="text-sm">{date}</div>
      </div>
      <div>{content}</div>
    </div>
  );
}
