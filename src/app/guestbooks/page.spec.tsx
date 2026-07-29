import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GuestbooksPage, { metadata } from "./page";

vi.mock("@/features/guestbook/ui", () => ({
  GuestbookList: () => <div>guestbook-list</div>,
}));
vi.mock("@/features/profile/ui", () => ({
  Contact: () => <div>contact</div>,
}));

describe("GuestbooksPage", () => {
  it("renders Contact and GuestbookList", async () => {
    render(await GuestbooksPage());

    expect(screen.getByText("contact")).toBeInTheDocument();
    expect(screen.getByText("guestbook-list")).toBeInTheDocument();
  });

  it("exports metadata", () => {
    expect(metadata.title).toBe("contact");
  });
});
