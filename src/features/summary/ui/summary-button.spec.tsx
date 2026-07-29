import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Import through the barrel to cover src/features/summary/ui/index.ts
import { SummaryButton } from "@/features/summary/ui";
import { updatePostSummary } from "../api/update-post-summary";

vi.mock("../api/update-post-summary", () => ({
  updatePostSummary: vi.fn(),
}));

describe("SummaryButton", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders SummaryCard on a successful summary", async () => {
    const user = userEvent.setup();
    vi.mocked(updatePostSummary).mockResolvedValue({
      success: true,
      summary: "생성된 요약",
    });

    render(<SummaryButton postId="p1" />);
    await user.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.getByText("생성된 요약")).toBeInTheDocument(),
    );
    expect(updatePostSummary).toHaveBeenCalledWith("p1");
  });

  it("shows the returned error message on failure", async () => {
    const user = userEvent.setup();
    vi.mocked(updatePostSummary).mockResolvedValue({
      success: false,
      error: "커스텀 에러",
    });

    render(<SummaryButton postId="p1" />);
    await user.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.getByText(/커스텀 에러/)).toBeInTheDocument(),
    );
  });

  it("shows a fallback error when failure has no error message", async () => {
    const user = userEvent.setup();
    vi.mocked(updatePostSummary).mockResolvedValue({ success: false });

    render(<SummaryButton postId="p1" />);
    await user.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.getByText(/요약 생성에 실패했습니다./)).toBeInTheDocument(),
    );
  });

  it("shows a catch error when updatePostSummary rejects", async () => {
    const user = userEvent.setup();
    vi.mocked(updatePostSummary).mockRejectedValue(new Error("boom"));

    render(<SummaryButton postId="p1" />);
    await user.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(
        screen.getByText(/요약 생성 중 오류가 발생했습니다/),
      ).toBeInTheDocument(),
    );
    expect(console.error).toHaveBeenCalled();
  });

  it("ignores a second click while generating (guard) and shows spinner", async () => {
    const user = userEvent.setup();
    let resolveFn: (v: { success: boolean; summary: string }) => void =
      () => {};
    const pending = new Promise<{ success: boolean; summary: string }>(
      (resolve) => {
        resolveFn = resolve;
      },
    );
    vi.mocked(updatePostSummary).mockReturnValue(pending as never);

    render(<SummaryButton postId="p1" />);
    const button = screen.getByRole("button");

    await user.click(button);
    // spinner while generating
    await waitFor(() =>
      expect(screen.getByText("요약 생성 중...")).toBeInTheDocument(),
    );

    // second click hits the `if (isGenerating) return` guard
    await user.click(button);
    expect(updatePostSummary).toHaveBeenCalledTimes(1);

    resolveFn({ success: true, summary: "끝" });
    await waitFor(() => expect(screen.getByText("끝")).toBeInTheDocument());
  });
});
