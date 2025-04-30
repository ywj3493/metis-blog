import { slug } from "github-slugger";
import type {
  IPost,
  ITag,
  PostDatabaseResponse,
  TagDatabaseResponse,
} from "./type";

export function isIPost(obj: unknown): obj is IPost {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const o = obj as IPost;

  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    Array.isArray(o.tags) &&
    o.tags.every(isITag) &&
    typeof o.cover === "string" &&
    typeof o.icon === "string" &&
    typeof o.publishTime === "string"
  );
}

export function isPostDatabaseResponse(
  obj: unknown,
): obj is PostDatabaseResponse {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const o = obj as PostDatabaseResponse;

  if (typeof o.id !== "string") return false;
  if (typeof o.properties !== "object" || o.properties === null) return false;
  if (
    typeof o.properties.제목 !== "object" ||
    !Array.isArray(o.properties.제목.title)
  )
    return false;
  if (
    !o.properties.제목.title.every(
      (titleItem) => typeof titleItem.plain_text === "string",
    )
  )
    return false;
  if (
    typeof o.properties.Tags !== "object" ||
    !Array.isArray(o.properties.Tags.multi_select)
  )
    return false;
  if (
    !o.properties.Tags.multi_select.every(
      (tag) =>
        typeof tag.id === "string" &&
        typeof tag.name === "string" &&
        typeof tag.color === "string",
    )
  )
    return false;
  if (
    typeof o.properties.날짜 !== "object" ||
    typeof o.properties.날짜.date !== "object"
  )
    return false;
  if (typeof o.properties.날짜.date.start !== "string") return false;
  if (typeof o.last_edited_time !== "string") return false;

  return true;
}

export class Post implements IPost {
  public id;
  public title;
  public slugifiedTitle;
  public tags;
  public cover;
  public icon;
  public publishTime;
  public lastEditedTime;

  protected constructor(post: IPost) {
    this.id = post.id;
    this.title = post.title;
    this.slugifiedTitle = post.slugifiedTitle;
    this.tags = post.tags.map(Tag.create);
    this.cover = post.cover;
    this.icon = post.icon;
    this.publishTime = post.publishTime;
    this.lastEditedTime = post.lastEditedTime;
  }

  public static create(data: unknown) {
    if (data instanceof Post) return data;
    if (isIPost(data)) {
      return new Post(data);
    }
    if (isPostDatabaseResponse(data)) {
      const title = data.properties.제목.title[0].plain_text;
      const tags = data.properties.Tags.multi_select;
      const cover = data.cover?.external?.url ?? "";
      const icon = data.icon?.external?.url ?? "/mascot.png";
      const publishTime = data.properties.날짜.date.start;
      const lastEditedTime = data.last_edited_time;
      return new Post({
        id: data.id,
        title,
        slugifiedTitle: slug(title),
        tags,
        cover,
        icon,
        publishTime,
        lastEditedTime,
      });
    }
    throw Error("Post 객체 생성 오류");
  }
}

export function isITag(obj: unknown): obj is ITag {
  const o = obj as ITag;
  return (
    o !== null &&
    typeof o === "object" &&
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.color === "string"
  );
}

export function isTagDatabaseResponse(
  obj: unknown,
): obj is TagDatabaseResponse {
  const o = obj as TagDatabaseResponse;
  return (
    o !== null &&
    typeof o.color === "string" &&
    typeof o.id === "string" &&
    typeof o.name === "string"
  );
}

export class Tag implements ITag {
  public id;
  public name;
  public color;
  public description;

  protected constructor(tag: ITag) {
    this.id = tag.id;
    this.name = tag.name;
    this.color = tag.color;
    this.description = tag.description;
  }

  public static create(data: unknown) {
    if (data instanceof Tag) return data;
    if (isITag(data)) {
      return new Tag(data);
    }
    if (isTagDatabaseResponse(data)) {
      return new Tag(data);
    }
    throw Error("Tag 객체 생성 오류");
  }
}
