import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// Import through the barrel to cover src/widgets/ui/index.ts
import { Footer } from "@/widgets/ui";

describe("Footer", () => {
  it("renders the footer text", () => {
    render(<Footer />);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
