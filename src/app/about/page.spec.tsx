import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNotionAboutPage } from "@/entities/post/api";
import AboutPage, { metadata, revalidate } from "./page";

vi.mock("@/entities/post/api", () => ({
  getNotionAboutPage: vi.fn(),
}));
vi.mock("@/features/post/ui", () => ({
  ClientNotionRenderer: () => <div>renderer</div>,
}));
vi.mock("@/features/profile/ui", () => ({
  Contact: () => <div>contact</div>,
}));

const mockedGetAbout = vi.mocked(getNotionAboutPage);

describe("AboutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the about page content", async () => {
    mockedGetAbout.mockResolvedValueOnce({} as never);

    render(await AboutPage());

    expect(screen.getByText("renderer")).toBeInTheDocument();
    expect(screen.getByText("contact")).toBeInTheDocument();
  });

  it("exports metadata and revalidate", () => {
    expect(metadata.title).toBe("about");
    expect(revalidate).toBe(180);
  });
});
