import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { IGuestbook, MetisGuestbookDatabaseResponse } from "./type";

export function isIGuestbook(obj: unknown): obj is IGuestbook {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const o = obj as IGuestbook;

  return (
    typeof o.id === "string" &&
    typeof o.content === "string" &&
    typeof o.name === "string" &&
    typeof o.status === "string" &&
    typeof o.date === "string"
  );
}

export function isMetisGuestbookDatabaseResponse(
  obj: unknown
): obj is MetisGuestbookDatabaseResponse {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const o = obj as MetisGuestbookDatabaseResponse;

  if (typeof o.id !== "string") return false;
  if (typeof o.properties !== "object" || o.properties === null) return false;
  if (
    typeof o.properties.작성자 !== "object" ||
    !Array.isArray(o.properties.작성자.title)
  )
    return false;

  if (
    !o.properties.작성자.title.every(
      (titleItem) => typeof titleItem.plain_text === "string"
    )
  )
    return false;
  if (
    typeof o.properties.방명록 !== "object" ||
    !Array.isArray(o.properties.작성자.title)
  )
    return false;

  if (
    !o.properties.방명록.rich_text.every(
      (textItem) => typeof textItem.plain_text === "string"
    )
  )
    return false;

  if (typeof o.properties.남긴날짜 !== "object" || o.properties === null)
    return false;
  if (
    typeof o.properties.남긴날짜.date !== "object" ||
    o.properties.남긴날짜 === null
  )
    return false;
  if (typeof o.properties.남긴날짜.date.start !== "string") return false;

  if (typeof o.properties.상태 !== "object" || o.properties === null)
    return false;
  if (
    typeof o.properties.상태.status !== "object" ||
    o.properties.상태 === null
  )
    return false;
  if (o.properties.상태.status.name !== ("공개" || "비공개")) return false;

  return true;
}

export class Guestbook implements IGuestbook {
  public id;
  public name;
  public content;
  public date;
  public status;
  public isPublic;

  protected constructor({ id, name, content, date, status }: IGuestbook) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.date = date;
    this.status = status;
    this.isPublic = status === "공개";
  }

  public static create(data: Guestbook | IGuestbook | DatabaseObjectResponse) {
    if (data instanceof Guestbook) return data;
    if (isIGuestbook(data)) {
      return new Guestbook(data);
    }
    if (isMetisGuestbookDatabaseResponse(data)) {
      const id = data.id;
      const name = data.properties["작성자"].title[0].plain_text;
      const content = data.properties["방명록"].rich_text[0].plain_text;
      const date = data.properties["남긴날짜"].date.start.split("T")[0];
      const status = data.properties["상태"].status.name;

      return new Guestbook({ id, name, content, date, status });
    }
  }
}
