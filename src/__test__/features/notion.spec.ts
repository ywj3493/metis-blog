import { describe, expect, it } from "vitest";
import { getNotionPosts } from "@/entities/post/api";
import { Post } from "@/entities/post/model";
import { server } from "@/mocks/server";

const isDeepTest = !!process.env.DEEP_TEST;

describe.skipIf(!isDeepTest)("Deep test for Notion API", () => {
  it("should load env variables", () => {
    expect(process.env.NOTION_KEY).toBeDefined();
    expect(process.env.NOTION_POST_DATABASE_ID).toBeDefined();
    expect(process.env.NOTION_GUESTBOOK_DATABASE_ID).toBeDefined();
    expect(process.env.NOTION_USER_ID).toBeDefined();
    expect(process.env.NOTION_TOKEN_V2).toBeDefined();
  });

  it(
    "should create Post model correctly for all posts",
    { timeout: Number.POSITIVE_INFINITY },
    async () => {
      server.close();
      const posts = (await getNotionPosts()).map(Post.create);

      expect(posts).toBeDefined();
      expect(posts.length).toBeGreaterThan(0);
      for (const post of posts) {
        expect(post.title).toBeTruthy();
        expect(post.slugifiedTitle).toBeTruthy();
        expect(post.tags).toBeDefined();
      }
      server.listen();
    },
  );
});
