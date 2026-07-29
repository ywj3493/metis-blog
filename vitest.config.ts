import path from "node:path";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

// Load .env.local file
dotenv.config({
  path: path.resolve(__dirname, ".env.local"),
});

/**
 * Stub every `.css` import as an empty module.
 *
 * The app imports global CSS (Tailwind directives) and third-party CSS from
 * packages that are optional peers and may not be installed (prismjs, katex).
 * None of it matters for behaviour under test, so we short-circuit resolution
 * to keep every component importable.
 */
function stubCssPlugin(): Plugin {
  const VIRTUAL = "\0virtual:empty-css";
  return {
    name: "stub-css",
    enforce: "pre",
    resolveId(id) {
      if (id.endsWith(".css")) return VIRTUAL;
      return null;
    },
    load(id) {
      if (id === VIRTUAL) return "";
      return null;
    },
  };
}

export default defineConfig({
  plugins: [stubCssPlugin(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    exclude: ["**/node_modules/**", "**/.claude/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts", // type-only definitions
        "**/*.spec.{ts,tsx}", // test files
        "src/__test__/**", // legacy deep-test dir
        "src/mocks/**", // MSW test infrastructure & stubs
        "src/shared/api/notion-mock.ts", // dev/test-only Notion mock client
      ],
      // Practical 100%: every included file must be fully covered.
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next/font/local": path.resolve(
        __dirname,
        "./src/mocks/stubs/next-font-local.ts",
      ),
    },
  },
});
