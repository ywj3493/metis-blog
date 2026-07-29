import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Contact } from "./index";

describe("Contact", () => {
  it("renders the heading, email and external links", () => {
    render(
      <TooltipProvider>
        <Contact />
      </TooltipProvider>,
    );

    expect(screen.getByText("연락처")).toBeInTheDocument();
    expect(screen.getByText("dbsdndwo12@gmail.com")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "https://github.com/ywj3493");
  });
});
