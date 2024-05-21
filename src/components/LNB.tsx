"use client";

type LNBProps = {
  tags: string[];
};

export default function LNB({ tags }: LNBProps) {
  return (
    <div>
      {tags.map((tag) => (
        <div key={tag}>{tag}</div>
      ))}
    </div>
  );
}
