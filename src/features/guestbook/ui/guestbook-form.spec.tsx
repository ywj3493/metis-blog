import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendAlarmEmail } from "@/entities/alarm/api";
import { createGuestbook } from "../api";
import { GuestbookForm } from "./guestbook-form";

vi.mock("../api", () => ({
  createGuestbook: vi.fn(),
}));

vi.mock("@/entities/alarm/api", () => ({
  sendAlarmEmail: vi.fn(),
}));

describe("GuestbookForm", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("keeps submit disabled until required fields are filled", () => {
    render(<GuestbookForm refetch={vi.fn()} />);

    expect(screen.getByRole("button", { name: "전송" })).toBeDisabled();
  });

  it("submits successfully: resets, sends an alarm email, and refetches", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn().mockResolvedValue(undefined);
    vi.mocked(createGuestbook).mockResolvedValue({});

    render(<GuestbookForm refetch={refetch} />);

    await user.type(screen.getByPlaceholderText("이름"), "메티");
    await user.type(screen.getByPlaceholderText("내용"), "안녕하세요");

    const submit = screen.getByRole("button", { name: "전송" });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() =>
      expect(createGuestbook).toHaveBeenCalledWith({
        name: "메티",
        content: "안녕하세요",
        isPrivate: false,
      }),
    );
    await waitFor(() => expect(sendAlarmEmail).toHaveBeenCalled());
    expect(refetch).toHaveBeenCalled();
    // reset clears the name field
    await waitFor(() =>
      expect(screen.getByPlaceholderText("이름")).toHaveValue(""),
    );
  });

  it("toggles the private checkbox and submits with isPrivate true", async () => {
    const user = userEvent.setup();
    vi.mocked(createGuestbook).mockResolvedValue({});

    render(<GuestbookForm refetch={vi.fn().mockResolvedValue(undefined)} />);

    const checkbox = screen.getByLabelText("비공개") as HTMLInputElement;
    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);

    await user.type(screen.getByPlaceholderText("이름"), "메티");
    await user.type(screen.getByPlaceholderText("내용"), "비공개 글");

    const submit = screen.getByRole("button", { name: "전송" });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() =>
      expect(createGuestbook).toHaveBeenCalledWith({
        name: "메티",
        content: "비공개 글",
        isPrivate: true,
      }),
    );
  });

  it("shows the loading spinner while the request is pending", async () => {
    const user = userEvent.setup();
    let resolveFn: () => void = () => {};
    vi.mocked(createGuestbook).mockReturnValue(
      new Promise<Record<string, never>>((resolve) => {
        resolveFn = () => resolve({});
      }),
    );

    const { container } = render(
      <GuestbookForm refetch={vi.fn().mockResolvedValue(undefined)} />,
    );

    await user.type(screen.getByPlaceholderText("이름"), "메티");
    await user.type(screen.getByPlaceholderText("내용"), "안녕");

    const submit = screen.getByRole("button", { name: "전송" });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() =>
      expect(container.querySelector(".animate-spin")).toBeInTheDocument(),
    );

    resolveFn();
  });

  it("logs an error when createGuestbook rejects", async () => {
    const user = userEvent.setup();
    vi.mocked(createGuestbook).mockRejectedValue(new Error("실패"));

    render(<GuestbookForm refetch={vi.fn().mockResolvedValue(undefined)} />);

    await user.type(screen.getByPlaceholderText("이름"), "메티");
    await user.type(screen.getByPlaceholderText("내용"), "안녕");

    const submit = screen.getByRole("button", { name: "전송" });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() => expect(console.error).toHaveBeenCalled());
  });
});
