import { fireEvent, render } from "@testing-library/react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
  ThemeProvider: ({ children }: { children?: ReactNode }) => children,
}));

import { ThemeToggle } from "./index";

describe("ThemeToggle", () => {
  afterEach(() => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: vi.fn(),
    } as unknown as ReturnType<typeof useTheme>);
  });

  it("shows the dark-mode icon when theme is light and switches to dark on click", () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme,
    } as unknown as ReturnType<typeof useTheme>);

    const { container } = render(<ThemeToggle />);

    const icon = container.querySelector("svg");
    expect(icon).toBeTruthy();

    fireEvent.click(icon as Element);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("shows the light-mode icon otherwise and switches to light on click", () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme,
    } as unknown as ReturnType<typeof useTheme>);

    const { container } = render(<ThemeToggle />);

    const icon = container.querySelector("svg");
    expect(icon).toBeTruthy();

    fireEvent.click(icon as Element);
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
