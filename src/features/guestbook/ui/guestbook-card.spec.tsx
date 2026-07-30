import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Guestbook } from "@/entities/guestbook/model";
import { GuestbookCard } from "./guestbook-card";

describe("GuestbookCard", () => {
  it("renders a private-notice for a non-public guestbook", () => {
    const guestbook = Guestbook.create({
      id: "g1",
      name: "메티",
      content: "비밀 내용",
      date: "2024-01-01",
      status: "비공개",
    });

    render(<GuestbookCard guestbook={guestbook} />);

    expect(screen.getByText("비공개 방명록 입니다.")).toBeInTheDocument();
    expect(screen.queryByText("비밀 내용")).not.toBeInTheDocument();
  });

  it("renders name, date and content for a public guestbook", () => {
    const guestbook = Guestbook.create({
      id: "g2",
      name: "홍길동",
      content: "반갑습니다",
      date: "2024-02-02",
      status: "공개",
    });

    render(<GuestbookCard guestbook={guestbook} />);

    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("2024-02-02")).toBeInTheDocument();
    expect(screen.getByText("반갑습니다")).toBeInTheDocument();
  });
});
