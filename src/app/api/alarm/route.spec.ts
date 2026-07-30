import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendEamil } from "@/entities/alarm/model";
import { POST } from "./route";

vi.mock("@/entities/alarm/model", () => ({
  sendEamil: vi.fn(),
}));

const mockedSendEamil = vi.mocked(sendEamil);

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/alarm", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/alarm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when body fails validation", async () => {
    const res = await POST(makeRequest({ from: 1 }));

    expect(res.status).toBe(400);
    expect(await res.text()).toBe(
      "보내는이, 제목, 내용은 문자열만 가능합니다.",
    );
    expect(mockedSendEamil).not.toHaveBeenCalled();
  });

  it("returns 200 when email is sent successfully", async () => {
    mockedSendEamil.mockResolvedValueOnce(undefined as never);

    const res = await POST(
      makeRequest({ from: "a@a.com", subject: "hi", message: "hello" }),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "메일을 성공적으로 보냈음" });
    expect(mockedSendEamil).toHaveBeenCalledWith({
      from: "a@a.com",
      subject: "hi",
      message: "hello",
    });
  });

  it("returns 500 when email sending fails", async () => {
    mockedSendEamil.mockRejectedValueOnce(new Error("boom"));

    const res = await POST(
      makeRequest({ from: "a@a.com", subject: "hi", message: "hello" }),
    );

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("메일 전송에 실패함");
  });
});
