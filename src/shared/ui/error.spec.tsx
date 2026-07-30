import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ErrorPage, ErrorSection } from "./error";

describe("ErrorPage", () => {
  it("renders the error page text", () => {
    render(<ErrorPage />);
    expect(screen.getByText("ErrorPage")).toBeInTheDocument();
  });
});

describe("ErrorSection", () => {
  it("shows the provided message", () => {
    render(<ErrorSection message="문제가 발생했습니다" />);
    expect(screen.getByText("문제가 발생했습니다")).toBeInTheDocument();
  });

  it("shows the default message when none is provided", () => {
    render(<ErrorSection />);
    expect(
      screen.getByText("알수없는 오류로 인해 표시 할 수 없습니다."),
    ).toBeInTheDocument();
  });
});
