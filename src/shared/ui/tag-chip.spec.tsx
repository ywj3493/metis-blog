import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "next-themes";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Import through the barrel to cover src/shared/ui/index.ts
import { TagChip } from "@/shared/ui";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
}));

describe("TagChip", () => {
  beforeEach(() => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: vi.fn(),
      themes: [],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders in dark theme with default color and calls onClick with id", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <TagChip id="t1" name="react" color="default" onClick={handleClick} />,
    );

    const button = screen.getByRole("button", { name: "react" });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledWith("t1");
  });

  it("renders in light theme and handles notSelected true", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: vi.fn(),
      themes: [],
    });

    render(<TagChip id="t2" name="brownTag" color="brown" notSelected />);

    expect(screen.getByRole("button", { name: "brownTag" })).toHaveClass(
      "bg-white-100",
    );
  });

  it("uses the raw color for non-default/non-brown colors when selected", () => {
    render(<TagChip id="t3" name="blueTag" color="blue" notSelected={false} />);

    expect(screen.getByRole("button", { name: "blueTag" })).toHaveClass(
      "bg-blue-100",
    );
  });

  it("does not throw when clicked without an onClick handler", async () => {
    const user = userEvent.setup();

    render(<TagChip id="t4" name="noHandler" color="default" />);

    await user.click(screen.getByRole("button", { name: "noHandler" }));
    expect(
      screen.getByRole("button", { name: "noHandler" }),
    ).toBeInTheDocument();
  });
});
