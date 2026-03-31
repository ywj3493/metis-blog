import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * CI 빌드용 Notion mock 데이터
 * CI_MOCK=true일 때 실제 API 호출 없이 빌드를 통과시키기 위한 최소 데이터
 */

const mockPostId = "00000000-0000-0000-0000-000000000001";

export const MOCK_POSTS: DatabaseObjectResponse[] = [
  {
    object: "page",
    id: mockPostId,
    created_time: "2024-01-01T00:00:00.000Z",
    last_edited_time: "2024-01-01T00:00:00.000Z",
    created_by: { object: "user", id: "mock-user" },
    last_edited_by: { object: "user", id: "mock-user" },
    archived: false,
    in_trash: false,
    url: "",
    public_url: null,
    parent: { type: "database_id", database_id: "mock-db" },
    cover: {
      type: "external",
      external: { url: "" },
    },
    icon: {
      type: "external",
      external: { url: "/mascot.png" },
    },
    properties: {
      제목: {
        id: "title",
        type: "title",
        title: [
          {
            type: "text",
            text: { content: "CI Mock Post", link: null },
            plain_text: "CI Mock Post",
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default",
            },
            href: null,
          },
        ],
      },
      Tags: {
        id: "tags",
        type: "multi_select",
        multi_select: [{ id: "tag-1", name: "test", color: "gray" }],
      },
      날짜: {
        id: "date",
        type: "date",
        date: { start: "2024-01-01", end: null, time_zone: null },
      },
      상태: {
        id: "status",
        type: "status",
        status: { id: "s-1", name: "공개", color: "default" },
      },
      summary: {
        id: "summary",
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: "CI 빌드 검증용 mock 포스트입니다.", link: null },
            plain_text: "CI 빌드 검증용 mock 포스트입니다.",
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default",
            },
            href: null,
          },
        ],
      },
    },
  } as unknown as DatabaseObjectResponse,
];

export const MOCK_TAGS = [
  { id: "tag-1", name: "test", color: "gray", description: "" },
];

export const MOCK_PAGE_RECORD_MAP = {
  block: {
    [mockPostId]: {
      role: "reader",
      value: {
        id: mockPostId,
        version: 1,
        type: "page",
        properties: { title: [["CI Mock Post"]] },
        content: [],
        created_time: 1704067200000,
        last_edited_time: 1704067200000,
        parent_id: "mock-parent",
        parent_table: "space",
        alive: true,
        space_id: "mock-space",
      },
    },
  },
  collection: {},
  collection_view: {},
  notion_user: {},
  collection_query: {},
  signed_urls: {},
};
