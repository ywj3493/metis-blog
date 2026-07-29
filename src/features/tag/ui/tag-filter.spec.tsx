import { fireEvent, render, screen } from "@testing-library/react";
import { type ReactNode, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "@/entities/post/model";
import { TooltipProvider } from "@/shared/ui/tooltip";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
  ThemeProvider: ({ children }: { children?: ReactNode }) => children,
}));

import { TagFilter } from "./index";

const tags = [
  Tag.create({ id: "t1", name: "react", color: "blue" }),
  Tag.create({ id: "t2", name: "next", color: "gray" }),
];

function Wrapper({ initial }: { initial?: Set<string> }) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    initial ?? new Set(),
  );
  return (
    <TooltipProvider>
      <span data-testid="selected">{Array.from(selectedTags).join(",")}</span>
      <TagFilter
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
    </TooltipProvider>
  );
}

describe("TagFilter", () => {
  it("adds a tag when an unselected chip is clicked and removes it when clicked again", () => {
    render(<Wrapper />);

    const chip = screen.getByRole("button", { name: "react" });

    fireEvent.click(chip);
    expect(screen.getByTestId("selected").textContent).toBe("t1");

    fireEvent.click(chip);
    expect(screen.getByTestId("selected").textContent).toBe("");
  });

  it("shows the scroll hint when not scrolled to the bottom", () => {
    render(<Wrapper />);

    const scrollContainer = document.querySelector(
      ".overflow-y-auto",
    ) as HTMLElement;

    Object.defineProperty(scrollContainer, "scrollTop", {
      configurable: true,
      value: 0,
    });
    Object.defineProperty(scrollContainer, "clientHeight", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(scrollContainer, "scrollHeight", {
      configurable: true,
      value: 1000,
    });

    fireEvent.scroll(scrollContainer);

    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  it("hides the scroll hint when scrolled to the bottom", () => {
    render(<Wrapper />);

    const scrollContainer = document.querySelector(
      ".overflow-y-auto",
    ) as HTMLElement;

    Object.defineProperty(scrollContainer, "scrollTop", {
      configurable: true,
      value: 900,
    });
    Object.defineProperty(scrollContainer, "clientHeight", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(scrollContainer, "scrollHeight", {
      configurable: true,
      value: 1000,
    });

    fireEvent.scroll(scrollContainer);

    expect(screen.queryByText("▼")).not.toBeInTheDocument();
  });
});
