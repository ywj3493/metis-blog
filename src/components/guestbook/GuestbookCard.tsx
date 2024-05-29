type GuestbookCardProps = {
  guestbook: any;
};

export default function GuestbookCard({ guestbook }: GuestbookCardProps) {
  const name = guestbook.properties["작성자"].title[0].plain_text;
  const content = guestbook.properties["방명록"].rich_text[0].plain_text;
  return (
    <div className="flex p-4">
      <h1>{name}</h1>
      <div>{content}</div>
    </div>
  );
}
