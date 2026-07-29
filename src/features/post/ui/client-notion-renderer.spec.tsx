import { render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import type { ExtendedRecordMap } from "notion-types";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
  ThemeProvider: ({ children }: { children?: ReactNode }) => children,
}));

vi.mock("react-notion-x", () => ({
  NotionRenderer: (props: { darkMode?: boolean; recordMap?: unknown }) => (
    <div data-testid="nr" data-dark={String(props.darkMode)} />
  ),
}));

vi.mock("react-notion-x/build/third-party/code", () => ({
  Code: () => null,
}));
vi.mock("react-notion-x/build/third-party/collection", () => ({
  Collection: () => null,
}));
vi.mock("react-notion-x/build/third-party/equation", () => ({
  Equation: () => null,
}));

import { ClientNotionRenderer } from "./client-notion-renderer";

describe("ClientNotionRenderer", () => {
  it("passes darkMode true when the theme is dark", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: vi.fn(),
    } as unknown as ReturnType<typeof useTheme>);

    render(
      <ClientNotionRenderer recordMap={{} as unknown as ExtendedRecordMap} />,
    );

    expect(screen.getByTestId("nr")).toHaveAttribute("data-dark", "true");
  });

  it("passes darkMode false when the theme is light", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: vi.fn(),
    } as unknown as ReturnType<typeof useTheme>);

    render(
      <ClientNotionRenderer recordMap={{} as unknown as ExtendedRecordMap} />,
    );

    expect(screen.getByTestId("nr")).toHaveAttribute("data-dark", "false");
  });
});
