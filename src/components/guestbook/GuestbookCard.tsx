type GuestbookCardProps = {
  guestbook: any;
};

export default function GuestbookCard({ guestbook }: GuestbookCardProps) {
  const name = guestbook.properties["작성자"].title[0].plain_text;
  const content = guestbook.properties["방명록"].rich_text[0].plain_text;
  const status = guestbook.properties["상태"].status.name === "공개";

  if (!status) {
    return <div>비공개 방명록 입니다.</div>;
  }

  return (
    <div className="flex p-4">
      <h1>{name}</h1>
      <div>{content}</div>
    </div>
  );
}
