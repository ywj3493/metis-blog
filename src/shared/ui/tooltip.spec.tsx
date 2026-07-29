import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

describe("Tooltip", () => {
  it("mounts the content when the tooltip is open (default sideOffset)", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>trigger</TooltipTrigger>
          <TooltipContent>content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByText("trigger")).toBeInTheDocument();
    // Radix duplicates content into an aria-live region, so allow multiple.
    expect(screen.getAllByText("content").length).toBeGreaterThan(0);
  });

  it("renders content with a custom sideOffset and className", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>trigger2</TooltipTrigger>
          <TooltipContent sideOffset={12} className="custom-tooltip">
            custom
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getAllByText("custom").length).toBeGreaterThan(0);
  });
});
