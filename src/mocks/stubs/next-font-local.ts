/**
 * Test stub for `next/font/local`.
 *
 * `next/font/local` relies on the Next.js compiler transform and cannot run
 * under Vitest. This stub is wired in via `resolve.alias` in vitest.config.ts
 * so any module importing a local font (e.g. app/layout.tsx) stays importable
 * in tests. It mirrors the shape Next returns from a font loader.
 */
export default function localFont(_options: unknown) {
  return {
    className: "font-mock",
    variable: "--font-mock",
    style: { fontFamily: "mock" },
  };
}
