import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { TagDatabaseResponse } from "@/entities/post/model/type";
import { TooltipProvider } from "@/shared/ui/tooltip";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
  ThemeProvider: ({ children }: { children?: ReactNode }) => children,
}));

import { FilterablePosts } from "./filterable-post";

const makeDbPost = (id: string, title: string, tag: TagDatabaseResponse) =>
  ({
    object: "page",
    id,
    last_edited_time: "2024-01-01T00:00:00.000Z",
    cover: { type: "external", external: { url: "" } },
    icon: { type: "external", external: { url: "/mascot.png" } },
    properties: {
      제목: {
        id: "title",
        type: "title",
        title: [{ type: "text", plain_text: title }],
      },
      Tags: {
        id: "tags",
        type: "multi_select",
        multi_select: [{ id: tag.id, name: tag.name, color: tag.color }],
      },
      날짜: {
        id: "date",
        type: "date",
        date: { start: "2024-01-01", end: null, time_zone: null },
      },
      summary: { id: "summary", type: "rich_text", rich_text: [] },
    },
  }) as unknown as DatabaseObjectResponse;

const tagReact: TagDatabaseResponse = {
  id: "t1",
  name: "react",
  color: "blue",
  description: "",
};
const tagNext: TagDatabaseResponse = {
  id: "t2",
  name: "next",
  color: "gray",
  description: "",
};
const tagUnused: TagDatabaseResponse = {
  id: "t3",
  name: "vue",
  color: "green",
  description: "",
};

const tagDataList = [tagReact, tagNext, tagUnused];
const dataList = [
  makeDbPost("p1", "Alpha Post", tagReact),
  makeDbPost("p2", "Beta Post", tagNext),
];

describe("FilterablePosts", () => {
  it("shows all posts initially and filters by the selected tag", () => {
    render(
      <TooltipProvider>
        <FilterablePosts tagDataList={tagDataList} dataList={dataList} />
      </TooltipProvider>,
    );

    expect(screen.getByText("Alpha Post")).toBeInTheDocument();
    expect(screen.getByText("Beta Post")).toBeInTheDocument();

    // unused tag is not active, so no chip is rendered for it
    expect(
      screen.queryByRole("button", { name: "vue" }),
    ).not.toBeInTheDocument();

    const filter = document.querySelector(".overflow-y-auto") as HTMLElement;
    fireEvent.click(within(filter).getByRole("button", { name: "react" }));

    expect(screen.getByText("Alpha Post")).toBeInTheDocument();
    expect(screen.queryByText("Beta Post")).not.toBeInTheDocument();
  });

  it("renders EmptyPosts when there are no posts to show", () => {
    render(
      <TooltipProvider>
        <FilterablePosts tagDataList={tagDataList} dataList={[]} />
      </TooltipProvider>,
    );

    expect(
      screen.getByText("선택된 태그 관련 포스트가 없습니다."),
    ).toBeInTheDocument();
  });
});
