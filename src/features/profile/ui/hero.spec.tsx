import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Hero } from "./index";

describe("Hero", () => {
  it("renders the intro text, image and github button", () => {
    render(
      <TooltipProvider>
        <Hero />
      </TooltipProvider>,
    );

    expect(screen.getByText("안녕하세요. 메티입니다.")).toBeInTheDocument();
    expect(screen.getByAltText("profile_image")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Github/ }).length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://github.com/ywj3493/metis-blog",
    );
  });
});
