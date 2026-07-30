import { afterEach, describe, expect, it, vi } from "vitest";
import { createGuestbook, getGuestbooks } from "./index";

describe("guestbook api", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  describe("createGuestbook", () => {
    const form = { name: "메티", content: "안녕하세요", isPrivate: false };

    it("returns data on a successful response", async () => {
      const data = { id: "g1" };
      const jsonMock = vi.fn().mockResolvedValue(data);
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: jsonMock });
      vi.stubGlobal("fetch", fetchMock);

      const result = await createGuestbook(form);

      expect(result).toEqual(data);
      expect(fetchMock).toHaveBeenCalledWith("/api/guestbooks", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
    });

    it("throws with the server message when not ok", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockResolvedValue({ message: "서버 에러" }),
        }),
      );

      await expect(createGuestbook(form)).rejects.toThrow("서버 에러");
    });

    it("throws with the fallback message when no message is present", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockResolvedValue({}),
        }),
      );

      await expect(createGuestbook(form)).rejects.toThrow(
        "알 수 없는 서버 에러",
      );
    });
  });

  describe("getGuestbooks", () => {
    it("returns the destructured data on success", async () => {
      const data = [{ id: "g1" }];
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ data }),
        }),
      );

      const result = await getGuestbooks();

      expect(result).toEqual(data);
      expect(fetch).toHaveBeenCalledWith("/api/guestbooks", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("throws with the message when not ok", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockResolvedValue({ data: { message: "실패" } }),
        }),
      );

      await expect(getGuestbooks()).rejects.toThrow("실패");
    });

    it("throws with the fallback message when data has no message", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockResolvedValue({ data: {} }),
        }),
      );

      await expect(getGuestbooks()).rejects.toThrow("알 수 없는 서버 에러");
    });
  });
});
