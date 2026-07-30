import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  LoadingDot,
  LoadingPage,
  LoadingSection,
  LoadingSpinner,
} from "./loading";

describe("Loading components", () => {
  it("renders LoadingPage", () => {
    const { container } = render(<LoadingPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders LoadingSection", () => {
    const { container } = render(<LoadingSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders LoadingSpinner", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders LoadingDot", () => {
    const { container } = render(<LoadingDot />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
