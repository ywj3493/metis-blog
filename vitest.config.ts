import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

// Load .env.local file
dotenv.config({
  path: path.resolve(__dirname, ".env.local"),
});

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
