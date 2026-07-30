import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendAlarmEmail } from "./index";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const form = {
  from: "guest@example.com",
  subject: "제목",
  message: "메시지",
};

describe("sendAlarmEmail", () => {
  it("posts the form to /api/alarm and returns the data when ok", async () => {
    const data = { success: true };
    fetchMock.mockResolvedValue({ ok: true, json: async () => data });

    const result = await sendAlarmEmail(form);

    expect(result).toBe(data);
    expect(fetchMock).toHaveBeenCalledWith("/api/alarm", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
  });

  it("throws with the server message when the response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "서버 오류입니다" }),
    });

    await expect(sendAlarmEmail(form)).rejects.toThrow("서버 오류입니다");
  });

  it("throws a fallback message when the error message is absent", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(sendAlarmEmail(form)).rejects.toThrow("알 수 없는 서버 에러");
  });
});
