import { server } from "@/mocks/server";
import {
  getNotionPostMetadata,
  getNotionPosts,
} from "@/services/_external/notion";
import { describe, expect, it } from "vitest";

describe("Test for build all posts", () => {
  it("should load env variables", () => {
    expect(process.env.NOTION_KEY).toBeDefined();
    expect(process.env.NOTION_POST_DATABASE_ID).toBeDefined();
    expect(process.env.NOTION_GUESTBOOK_DATABASE_ID).toBeDefined();
    expect(process.env.NOTION_USER_ID).toBeDefined();
    expect(process.env.NOTION_TOKEN_V2).toBeDefined();
  });
  if (process.env.DEEP_TEST) {
    it(
      "should make metadata correctly for all posts",
      { timeout: Infinity },
      async () => {
        server.close();
        const posts = await getNotionPosts();
        const metadatas = await Promise.all(
          posts.map((post) => getNotionPostMetadata(post.id))
        );

        expect(metadatas).toBeDefined();
        server.listen();
      }
    );
  }
});
