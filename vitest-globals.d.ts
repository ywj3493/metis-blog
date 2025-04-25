// vitest-globals.d.ts
export {};

declare global {
  var expect: typeof import("vitest")["expect"];
}
