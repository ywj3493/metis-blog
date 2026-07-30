import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
  const sendMailMock = vi.fn().mockResolvedValue({ ok: true });
  const createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }));
  return { sendMailMock, createTransportMock };
});

vi.mock("nodemailer", () => ({
  default: { createTransport: createTransportMock },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("AUTH_USER", "owner@example.com");
  vi.stubEnv("AUTH_PASS", "app-password");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sendEamil", () => {
  it("configures the smtp transporter at import time", async () => {
    await import("./index");
    expect(createTransportMock).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
      }),
    );
  });

  it("builds the mail data with a [BLOG] subject prefix and sends it", async () => {
    const { sendEamil } = await import("./index");

    const result = await sendEamil({
      from: "guest@example.com",
      subject: "문의합니다",
      message: "안녕하세요",
    });

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const mailData = sendMailMock.mock.calls[0][0];
    expect(mailData.to).toBe("owner@example.com");
    expect(mailData.subject).toBe("[BLOG] 문의합니다");
    expect(mailData.from).toBe("guest@example.com");
    expect(mailData.html).toContain("<h1>문의합니다</h1>");
    expect(mailData.html).toContain("<div>안녕하세요</div>");
    expect(mailData.html).toContain("보낸사람: guest@example.com");
    expect(result).toEqual({ ok: true });
  });
});
