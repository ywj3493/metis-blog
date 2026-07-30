import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config.
 *
 * The dev server is started with `CI_MOCK=true`, which makes the Notion data
 * layer return the fixtures in `src/shared/api/notion-mock.ts` instead of
 * hitting the real Notion API. This lets the full site render (and the E2E
 * suite run) with no external credentials.
 *
 * A dedicated port (3100, not the default 3000) is used so the E2E suite never
 * reuses a developer's regular `pnpm dev` server — which would run without
 * `CI_MOCK` and make the mock-data assertions hit real/credential-less Notion.
 */
const PORT = 3100;
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
    // Never reuse an already-running server: always start a fresh one bound to
    // the dedicated port with CI_MOCK enabled, so the mock env is guaranteed.
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      CI_MOCK: "true",
      PORT: String(PORT),
    },
  },
});
