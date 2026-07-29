import { describe, expect, it } from "vitest";
import { NotionApiError } from "./errors";
import * as lib from "./index";

describe("shared/lib barrel", () => {
  it("re-exports symbols from errors and utils", () => {
    expect(lib.NotionApiError).toBe(NotionApiError);
    expect(typeof lib.cn).toBe("function");
  });
});
