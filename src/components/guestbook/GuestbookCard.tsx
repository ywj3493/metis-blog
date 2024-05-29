type GuestbookCardProps = {
  guestbook: any;
};

export default function GuestbookCard({ guestbook }: GuestbookCardProps) {
  const name = guestbook.properties["작성자"].title[0].plain_text;
  const content = guestbook.properties["방명록"].rich_text[0].plain_text;
  const date = guestbook.properties["남긴날짜"].date.start.split("T")[0];
  const status = guestbook.properties["상태"].status.name === "공개";

  if (!status) {
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
