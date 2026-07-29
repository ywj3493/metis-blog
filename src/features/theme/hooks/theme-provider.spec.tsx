import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
  ThemeProvider: ({ children }: { children?: ReactNode }) => children,
}));

import { ThemeProvider } from "./index";

describe("ThemeProvider", () => {
  it("renders children through the next-themes provider", () => {
    render(
      <ThemeProvider attribute="class">
        <span>child-content</span>
      </ThemeProvider>,
    );

    expect(screen.getByText("child-content")).toBeInTheDocument();
  });
});
