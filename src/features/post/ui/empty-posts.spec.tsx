import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyPosts } from "./empty-posts";

describe("EmptyPosts", () => {
  it("renders the empty message", () => {
    render(<EmptyPosts />);

    expect(
      screen.getByText("선택된 태그 관련 포스트가 없습니다."),
    ).toBeInTheDocument();
  });
});
