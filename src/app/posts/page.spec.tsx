import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNotionPostDatabaseTags, getNotionPosts } from "@/entities/post/api";
import PostListPage, { metadata, revalidate } from "./page";

vi.mock("@/entities/post/api", () => ({
  getNotionPosts: vi.fn(),
  getNotionPostDatabaseTags: vi.fn(),
}));

let receivedProps: { tagDataList: unknown; dataList: unknown } | null = null;
vi.mock("@/features/post/ui", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: test stub
  FilterablePosts: (props: any) => {
    receivedProps = props;
    return <div>filterable-posts</div>;
  },
}));

const mockedPosts = vi.mocked(getNotionPosts);
const mockedTags = vi.mocked(getNotionPostDatabaseTags);

describe("PostListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    receivedProps = null;
  });

  it("renders FilterablePosts with fetched data", async () => {
    mockedPosts.mockResolvedValueOnce([{ id: "p1" }] as never);
    mockedTags.mockResolvedValueOnce([{ id: "t1" }] as never);

    render(await PostListPage());

    expect(screen.getByText("filterable-posts")).toBeInTheDocument();
    expect(receivedProps).toEqual({
      dataList: [{ id: "p1" }],
      tagDataList: [{ id: "t1" }],
    });
  });

  it("exports metadata and revalidate", () => {
    expect(metadata.title).toBe("posts");
    expect(revalidate).toBe(180);
  });
});
