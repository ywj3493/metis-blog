import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getNotionGuestbooks,
  postNotionGuestbook,
} from "@/entities/guestbook/api";
import { GET, POST } from "./route";

vi.mock("@/entities/guestbook/api", () => ({
  getNotionGuestbooks: vi.fn(),
  postNotionGuestbook: vi.fn(),
}));

const mockedGet = vi.mocked(getNotionGuestbooks);
const mockedPost = vi.mocked(postNotionGuestbook);

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/guestbooks", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("GET /api/guestbooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with guestbook data", async () => {
    mockedGet.mockResolvedValueOnce([{ id: "1" }] as never);

    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe("게스트북을 성공적으로 가져왔습니다.");
    expect(json.data).toEqual([{ id: "1" }]);
  });

  it("returns 500 when fetching fails", async () => {
    mockedGet.mockRejectedValueOnce(new Error("boom"));

    const res = await GET();

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("게스트북 가져오기에 실패했습니다.");
  });
});

describe("POST /api/guestbooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when body is invalid", async () => {
    const res = await POST(makeRequest({ name: "meti" }));

    expect(res.status).toBe(400);
    expect(await res.text()).toBe("이름, 내용을 입력 해주세요.");
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it("returns 200 when creation succeeds", async () => {
    mockedPost.mockResolvedValueOnce({ id: "new" } as never);

    const res = await POST(
      makeRequest({ name: "meti", content: "hello", isPrivate: false }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe("게스트북을 성공적으로 생성했습니다.");
    expect(json.data).toEqual({ id: "new" });
    expect(mockedPost).toHaveBeenCalledWith({
      name: "meti",
      content: "hello",
      isPrivate: false,
    });
  });

  it("returns 500 when creation fails", async () => {
    mockedPost.mockRejectedValueOnce(new Error("boom"));

    const res = await POST(
      makeRequest({ name: "meti", content: "hello", isPrivate: false }),
    );

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("게스트북 생성에 실패했습니다.");
  });
});
