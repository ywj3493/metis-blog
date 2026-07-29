import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, buttonVariants } from "./button";

describe("Button", () => {
  it("renders a native button by default", () => {
    render(<Button>click</Button>);

    const button = screen.getByRole("button", { name: "click" });
    expect(button.tagName).toBe("BUTTON");
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="outline" size="lg">
        styled
      </Button>,
    );

    expect(screen.getByRole("button", { name: "styled" })).toHaveClass(
      "border",
    );
  });

  it("renders as child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/x">link</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "link" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/x");
  });

  it("exposes buttonVariants helper", () => {
    expect(typeof buttonVariants()).toBe("string");
  });
});
