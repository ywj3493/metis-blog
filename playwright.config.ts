import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config.
 *
 * The dev server is started with `CI_MOCK=true`, which makes the Notion data
 * layer return the fixtures in `src/shared/api/notion-mock.ts` instead of
 * hitting the real Notion API. This lets the full site render (and the E2E
 * suite run) with no external credentials.
 */
const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      CI_MOCK: "true",
    },
  },
});
