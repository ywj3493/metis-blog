import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Import through the barrel to cover src/widgets/ui/index.ts
import { Header } from "@/widgets/ui";

// Header renders <ThemeToggle/> which uses next-themes.
vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
}));

describe("Header", () => {
  it("renders the logo link to home with the mascot image", () => {
    render(<Header />);

    const homeLink = screen.getByRole("link", { name: /메티의 블로그/ });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(screen.getByAltText("icon")).toBeInTheDocument();
  });

  it("renders all menu links", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "소개" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "방명록" })).toHaveAttribute(
      "href",
      "/guestbooks",
    );
    expect(screen.getByRole("link", { name: "포스트" })).toHaveAttribute(
      "href",
      "/posts",
    );
  });
});
