import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomePage, { revalidate } from "./page";

vi.mock("@/features/post/ui", () => ({
  FeaturedPosts: () => <div>featured</div>,
}));
vi.mock("@/features/profile/ui", () => ({
  Hero: () => <div>hero</div>,
}));

describe("HomePage", () => {
  it("renders Hero and FeaturedPosts", () => {
    render(<HomePage />);

    expect(screen.getByText("hero")).toBeInTheDocument();
    expect(screen.getByText("featured")).toBeInTheDocument();
  });

  it("exports a numeric revalidate value", () => {
    expect(typeof revalidate).toBe("number");
  });
});
