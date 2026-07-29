import { describe, expect, it } from "vitest";
import {
  isIPost,
  isITag,
  isPostDatabaseResponse,
  isTagDatabaseResponse,
  Post,
  Tag,
} from "./index";
import type { IPost, PostDatabaseResponse } from "./type";

const validTag = { id: "t1", name: "react", color: "blue" };

const validIPost: IPost = {
  id: "p1",
  title: "Hello",
  slugifiedTitle: "hello",
  tags: [validTag],
  cover: "cover.png",
  icon: "icon.png",
  publishTime: "2024-01-01",
  lastEditedTime: "2024-01-02",
  aiSummary: "요약",
};

function validDbResponse(): PostDatabaseResponse {
  return {
    id: "p2",
    properties: {
      제목: { title: [{ plain_text: "제목입니다" }] },
      Tags: { multi_select: [{ id: "t1", name: "react", color: "blue" }] },
      날짜: { date: { start: "2024-01-01" } },
      summary: { rich_text: [{ plain_text: "AI 요약" }] },
    },
    cover: { external: { url: "cover.png" } },
    icon: { external: { url: "icon.png" } },
    last_edited_time: "2024-01-02T00:00:00.000Z",
  };
}

describe("isITag", () => {
  it("returns true for a valid tag", () => {
    expect(isITag(validTag)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isITag(null)).toBe(false);
  });

  it("returns false for a non-object", () => {
    expect(isITag("tag")).toBe(false);
  });

  it("returns false when a field type is wrong", () => {
    expect(isITag({ id: 1, name: "x", color: "y" })).toBe(false);
    expect(isITag({ id: "1", name: 2, color: "y" })).toBe(false);
    expect(isITag({ id: "1", name: "x", color: 3 })).toBe(false);
  });
});

describe("isTagDatabaseResponse", () => {
  it("returns true for a valid tag database response", () => {
    expect(isTagDatabaseResponse(validTag)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isTagDatabaseResponse(null)).toBe(false);
  });

  it("returns false when fields are missing/wrong type", () => {
    expect(isTagDatabaseResponse({ color: 1, id: "1", name: "x" })).toBe(false);
    expect(isTagDatabaseResponse({ color: "c", id: 1, name: "x" })).toBe(false);
    expect(isTagDatabaseResponse({ color: "c", id: "1", name: 2 })).toBe(false);
  });
});

describe("Tag.create", () => {
  it("returns the same instance when given a Tag", () => {
    const tag = Tag.create(validTag);
    expect(Tag.create(tag)).toBe(tag);
  });

  it("creates a Tag from an ITag", () => {
    const tag = Tag.create(validTag);
    expect(tag).toBeInstanceOf(Tag);
    expect(tag.id).toBe("t1");
    expect(tag.name).toBe("react");
    expect(tag.color).toBe("blue");
  });

  it("creates a Tag via the database-response branch", () => {
    // A non-object with string fields passes isTagDatabaseResponse but fails
    // isITag (which requires typeof === "object"), reaching that branch.
    const tagLike = () => {};
    Object.defineProperties(tagLike, {
      id: { value: "t9", enumerable: true },
      name: { value: "vue", enumerable: true },
      color: { value: "green", enumerable: true },
      description: { value: "d", enumerable: true },
    });
    const tag = Tag.create(tagLike);
    expect(tag).toBeInstanceOf(Tag);
    expect(tag.name).toBe("vue");
  });

  it("throws when the data is not a tag", () => {
    expect(() => Tag.create({ nope: true })).toThrow("Tag 객체 생성 오류");
  });
});

describe("isIPost", () => {
  it("returns true for a valid IPost", () => {
    expect(isIPost(validIPost)).toBe(true);
  });

  it("returns false for null and non-objects", () => {
    expect(isIPost(null)).toBe(false);
    expect(isIPost(42)).toBe(false);
  });

  it("returns false when any field is invalid", () => {
    expect(isIPost({ ...validIPost, id: 1 })).toBe(false);
    expect(isIPost({ ...validIPost, title: 1 })).toBe(false);
    expect(isIPost({ ...validIPost, tags: "no" })).toBe(false);
    expect(isIPost({ ...validIPost, tags: [{ bad: true }] })).toBe(false);
    expect(isIPost({ ...validIPost, cover: 1 })).toBe(false);
    expect(isIPost({ ...validIPost, icon: 1 })).toBe(false);
    expect(isIPost({ ...validIPost, publishTime: 1 })).toBe(false);
  });
});

describe("isPostDatabaseResponse", () => {
  it("returns true for a valid response", () => {
    expect(isPostDatabaseResponse(validDbResponse())).toBe(true);
  });

  it("returns false for null and non-objects", () => {
    expect(isPostDatabaseResponse(null)).toBe(false);
    expect(isPostDatabaseResponse("x")).toBe(false);
  });

  it("returns false when id is not a string", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.id = 1;
    expect(isPostDatabaseResponse(r)).toBe(false);
  });

  it("returns false when properties are missing", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.properties = null;
    expect(isPostDatabaseResponse(r)).toBe(false);
  });

  it("returns false when 제목 is invalid", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.properties.제목 = { title: "no" };
    expect(isPostDatabaseResponse(r)).toBe(false);
  });

  it("returns false when a 제목 title entry is invalid", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.properties.제목.title = [{ plain_text: 1 }];
    expect(isPostDatabaseResponse(r)).toBe(false);
  });

  it("returns false when Tags is invalid", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.properties.Tags = { multi_select: "no" };
    expect(isPostDatabaseResponse(r)).toBe(false);
  });

  it("returns false when a Tags entry is invalid", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.properties.Tags.multi_select = [{ id: 1, name: "x", color: "y" }];
    expect(isPostDatabaseResponse(r)).toBe(false);
  });

  it("returns false when 날짜 is invalid", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.properties.날짜 = { date: "no" };
    expect(isPostDatabaseResponse(r)).toBe(false);
  });

  it("returns false when 날짜.date.start is not a string", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.properties.날짜.date.start = 1;
    expect(isPostDatabaseResponse(r)).toBe(false);
  });

  it("returns false when last_edited_time is not a string", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.last_edited_time = 1;
    expect(isPostDatabaseResponse(r)).toBe(false);
  });

  it("returns false when summary is invalid", () => {
    const r = validDbResponse();
    // @ts-expect-error intentional invalid
    r.properties.summary = { rich_text: "no" };
    expect(isPostDatabaseResponse(r)).toBe(false);
  });
});

describe("Post.create", () => {
  it("returns the same instance when given a Post", () => {
    const post = Post.create(validIPost);
    expect(Post.create(post)).toBe(post);
  });

  it("creates a Post from an IPost", () => {
    const post = Post.create(validIPost);
    expect(post).toBeInstanceOf(Post);
    expect(post.title).toBe("Hello");
    expect(post.tags[0]).toBeInstanceOf(Tag);
  });

  it("creates a Post from a database response", () => {
    const post = Post.create(validDbResponse());
    expect(post.title).toBe("제목입니다");
    expect(post.slugifiedTitle).toBe(post.slugifiedTitle.toLowerCase());
    expect(post.cover).toBe("cover.png");
    expect(post.icon).toBe("icon.png");
    expect(post.aiSummary).toBe("AI 요약");
  });

  it("falls back to defaults when optional fields are absent", () => {
    const r = validDbResponse();
    r.cover = {};
    r.icon = undefined;
    r.properties.summary = { rich_text: [] };
    const post = Post.create(r);
    expect(post.cover).toBe("");
    expect(post.icon).toBe("/mascot.png");
    expect(post.aiSummary).toBe("");
  });

  it("throws when the data is neither a Post, IPost, nor db response", () => {
    expect(() => Post.create({ nope: true })).toThrow("Post 객체 생성 오류");
  });

  it("get aiSummarized reflects whether a summary exists", () => {
    expect(Post.create(validIPost).aiSummarized).toBe(true);
    expect(Post.create({ ...validIPost, aiSummary: "" }).aiSummarized).toBe(
      false,
    );
  });
});
