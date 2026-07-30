import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/analytics/react", () => ({ Analytics: () => null }));
vi.mock("@vercel/speed-insights/next", () => ({ SpeedInsights: () => null }));
vi.mock("@/features/theme/hooks", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: test stub
  ThemeProvider: ({ children }: any) => children,
}));
vi.mock("@/shared/ui/tooltip", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: test stub
  TooltipProvider: ({ children }: any) => children,
}));
vi.mock("@/widgets/ui", () => ({ Header: () => <div>header</div> }));

describe("RootLayout", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("renders children and exports metadata (non-production)", async () => {
    const { default: RootLayout, metadata } = await import("./layout");

    render(<RootLayout>hi there</RootLayout>);

    expect(screen.getByText("hi there")).toBeInTheDocument();
    expect(screen.getByText("header")).toBeInTheDocument();
    expect(metadata.title).toEqual({
      default: "메티의 블로그",
      template: "메티의 블로그 | %s",
    });
  });

  it("suppresses hydration warning in production", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    const { default: RootLayout } = await import("./layout");

    render(<RootLayout>prod content</RootLayout>);

    expect(screen.getByText("prod content")).toBeInTheDocument();
  });
});
