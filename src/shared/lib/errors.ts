export class NotionApiError extends Error {
  constructor(
    message: string,
    public override readonly cause?: unknown,
  ) {
    super(message);
    this.name = "NotionApiError";
  }
}

export class SummaryServiceError extends Error {
  constructor(
    message: string,
    public override readonly cause?: unknown,
  ) {
    super(message);
    this.name = "SummaryServiceError";
  }
}
