import { describe, expect, it } from "vitest";
import { Guestbook, isGuestbookDatabaseResponse, isIGuestbook } from "./index";

function validIGuestbook() {
  return {
    id: "id-1",
    name: "홍길동",
    content: "안녕하세요",
    status: "공개",
    date: "2024-01-01",
  };
}

function validDbResponse() {
  return {
    id: "db-id-1",
    properties: {
      작성자: { title: [{ plain_text: "홍길동" }] },
      방명록: { rich_text: [{ plain_text: "방명록 내용" }] },
      남긴날짜: { date: { start: "2024-01-01T12:00:00.000Z" } },
      상태: { status: { name: "공개" } },
    },
  };
}

describe("isIGuestbook", () => {
  it("returns false for non-object", () => {
    expect(isIGuestbook("not-an-object")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isIGuestbook(null)).toBe(false);
  });

  it("returns false when id is not a string", () => {
    expect(isIGuestbook({ ...validIGuestbook(), id: 123 })).toBe(false);
  });

  it("returns false when content is not a string", () => {
    expect(isIGuestbook({ ...validIGuestbook(), content: 123 })).toBe(false);
  });

  it("returns false when name is not a string", () => {
    expect(isIGuestbook({ ...validIGuestbook(), name: 123 })).toBe(false);
  });

  it("returns false when status is not a string", () => {
    expect(isIGuestbook({ ...validIGuestbook(), status: 123 })).toBe(false);
  });

  it("returns false when date is not a string", () => {
    expect(isIGuestbook({ ...validIGuestbook(), date: 123 })).toBe(false);
  });

  it("returns true for a valid IGuestbook", () => {
    expect(isIGuestbook(validIGuestbook())).toBe(true);
  });
});

describe("isGuestbookDatabaseResponse", () => {
  it("returns false for non-object", () => {
    expect(isGuestbookDatabaseResponse("string")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isGuestbookDatabaseResponse(null)).toBe(false);
  });

  it("returns false when id is not a string", () => {
    const o = validDbResponse();
    (o as unknown as { id: unknown }).id = 123;
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when properties is not an object", () => {
    const o = validDbResponse();
    (o as unknown as { properties: unknown }).properties = "nope";
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when properties is null", () => {
    const o = validDbResponse();
    (o as unknown as { properties: unknown }).properties = null;
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when 작성자 is not an object", () => {
    const o = validDbResponse();
    (o.properties as unknown as { 작성자: unknown }).작성자 = "nope";
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when 작성자.title is not an array", () => {
    const o = validDbResponse();
    (o.properties.작성자 as unknown as { title: unknown }).title = "nope";
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when a 작성자 title item plain_text is not a string", () => {
    const o = validDbResponse();
    o.properties.작성자.title = [{ plain_text: 123 as unknown as string }];
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when 방명록 is not an object", () => {
    const o = validDbResponse();
    (o.properties as unknown as { 방명록: unknown }).방명록 = "nope";
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when a 방명록 rich_text item plain_text is not a string", () => {
    const o = validDbResponse();
    o.properties.방명록.rich_text = [{ plain_text: 123 as unknown as string }];
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when 남긴날짜 is not an object", () => {
    const o = validDbResponse();
    (o.properties as unknown as { 남긴날짜: unknown }).남긴날짜 = "nope";
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when 남긴날짜.date is not an object", () => {
    const o = validDbResponse();
    (o.properties.남긴날짜 as unknown as { date: unknown }).date = "nope";
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when 남긴날짜.date.start is not a string", () => {
    const o = validDbResponse();
    (o.properties.남긴날짜.date as unknown as { start: unknown }).start = 123;
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when 상태 is not an object", () => {
    const o = validDbResponse();
    (o.properties as unknown as { 상태: unknown }).상태 = "nope";
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when 상태.status is not an object", () => {
    const o = validDbResponse();
    (o.properties.상태 as unknown as { status: unknown }).status = "nope";
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns false when 상태.status.name is not a string", () => {
    const o = validDbResponse();
    (o.properties.상태.status as unknown as { name: unknown }).name = 123;
    expect(isGuestbookDatabaseResponse(o)).toBe(false);
  });

  it("returns true for a valid database response", () => {
    expect(isGuestbookDatabaseResponse(validDbResponse())).toBe(true);
  });
});

describe("Guestbook.create", () => {
  it("returns the same instance when given a Guestbook", () => {
    const instance = Guestbook.create(validIGuestbook());
    expect(Guestbook.create(instance)).toBe(instance);
  });

  it("creates from an IGuestbook with isPublic true for 공개", () => {
    const g = Guestbook.create({ ...validIGuestbook(), status: "공개" });
    expect(g).toBeInstanceOf(Guestbook);
    expect(g.isPublic).toBe(true);
    expect(g.name).toBe("홍길동");
  });

  it("creates from an IGuestbook with isPublic false for 비공개", () => {
    const g = Guestbook.create({ ...validIGuestbook(), status: "비공개" });
    expect(g.isPublic).toBe(false);
  });

  it("creates from a database response and splits the date", () => {
    const g = Guestbook.create(validDbResponse());
    expect(g).toBeInstanceOf(Guestbook);
    expect(g.id).toBe("db-id-1");
    expect(g.name).toBe("홍길동");
    expect(g.content).toBe("방명록 내용");
    expect(g.date).toBe("2024-01-01");
    expect(g.status).toBe("공개");
    expect(g.isPublic).toBe(true);
  });

  it("creates from a database response with 비공개 status", () => {
    const o = validDbResponse();
    o.properties.상태.status.name = "비공개";
    const g = Guestbook.create(o);
    expect(g.isPublic).toBe(false);
  });

  it("throws when the data is invalid", () => {
    expect(() => Guestbook.create({ foo: "bar" })).toThrow("객체 생성 오류");
  });
});
