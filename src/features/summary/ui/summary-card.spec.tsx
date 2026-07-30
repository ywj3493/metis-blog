import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
// Import through the barrel to cover src/features/summary/ui/index.ts
import { SummaryCard } from "@/features/summary/ui";

describe("SummaryCard", () => {
  it("renders the provided summary text", () => {
    render(<SummaryCard summary="이것은 요약입니다." />);

    expect(screen.getByText("이것은 요약입니다.")).toBeInTheDocument();
    expect(screen.getByText("메티가 요약해드렸어요!")).toBeInTheDocument();
  });
});
