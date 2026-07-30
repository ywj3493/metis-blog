import { describe, expect, it } from "vitest";
import { NotionApiError, SummaryServiceError } from "./errors";

describe("NotionApiError", () => {
  it("is an Error with the right name and message", () => {
    const err = new NotionApiError("failed");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(NotionApiError);
    expect(err.name).toBe("NotionApiError");
    expect(err.message).toBe("failed");
    expect(err.cause).toBeUndefined();
  });

  it("preserves the cause when provided", () => {
    const cause = new Error("root");
    const err = new NotionApiError("failed", cause);
    expect(err.cause).toBe(cause);
  });
});

describe("SummaryServiceError", () => {
  it("is an Error with the right name and message", () => {
    const err = new SummaryServiceError("nope");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(SummaryServiceError);
    expect(err.name).toBe("SummaryServiceError");
    expect(err.message).toBe("nope");
    expect(err.cause).toBeUndefined();
  });

  it("preserves the cause when provided", () => {
    const cause = { code: 500 };
    const err = new SummaryServiceError("nope", cause);
    expect(err.cause).toBe(cause);
  });
});
