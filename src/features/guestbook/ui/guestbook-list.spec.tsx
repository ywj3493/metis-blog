import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GuestbookDatabaseResponse } from "@/entities/guestbook/model/type";
// Import through the barrel to cover src/features/guestbook/ui/index.ts
import { GuestbookList } from "@/features/guestbook/ui";
import { getGuestbooks } from "../api";

vi.mock("../api", () => ({
  getGuestbooks: vi.fn(),
  createGuestbook: vi.fn(),
}));

vi.mock("@/entities/alarm/api", () => ({
  sendAlarmEmail: vi.fn(),
}));

function makeDbResponse(
  id: string,
  name: string,
  content: string,
): GuestbookDatabaseResponse {
  return {
    id,
    properties: {
      작성자: { title: [{ plain_text: name }] },
      방명록: { rich_text: [{ plain_text: content }] },
      남긴날짜: { date: { start: "2024-01-01T00:00:00.000Z" } },
      상태: { status: { name: "공개" } },
    },
  };
}

describe("GuestbookList", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and renders guestbook cards", async () => {
    vi.mocked(getGuestbooks).mockResolvedValue([
      makeDbResponse("g1", "메티", "첫번째"),
      makeDbResponse("g2", "홍길동", "두번째"),
    ]);

    render(<GuestbookList />);

    await waitFor(() => expect(screen.getByText("첫번째")).toBeInTheDocument());
    expect(screen.getByText("두번째")).toBeInTheDocument();
  });

  it("shows the loading spinner while fetching", async () => {
    let resolveFn: (v: GuestbookDatabaseResponse[]) => void = () => {};
    vi.mocked(getGuestbooks).mockReturnValue(
      new Promise((resolve) => {
        resolveFn = resolve;
      }),
    );

    const { container } = render(<GuestbookList />);

    await waitFor(() =>
      expect(container.querySelector(".animate-spin")).toBeInTheDocument(),
    );

    resolveFn([]);
  });

  it("logs an error when the fetch rejects", async () => {
    vi.mocked(getGuestbooks).mockRejectedValue(new Error("실패"));

    render(<GuestbookList />);

    await waitFor(() => expect(console.error).toHaveBeenCalled());
  });
});
