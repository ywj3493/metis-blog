import { expect, test } from "@playwright/test";

test.describe("Posts", () => {
  test("posts list renders the tag filter and a post card", async ({
    page,
  }) => {
    await page.goto("/posts");

    // Tag filter heading
    await expect(page.getByText("태그", { exact: true })).toBeVisible();

    // The mock post and its tag
    await expect(page.getByText("CI Mock Post").first()).toBeVisible();
  });

  test("opens a post detail page from the list", async ({ page }) => {
    await page.goto("/posts");
    await page.getByText("CI Mock Post").first().click();
    await expect(page).toHaveURL(/\/posts\/ci-mock-post$/);
  });

  test("post detail page renders the notion content region", async ({
    page,
  }) => {
    await page.goto("/posts/ci-mock-post");
    // Navigator section is always present on a detail page
    await expect(
      page.getByText(/다음 글이 없습니다\.|다음 포스트/),
    ).toBeVisible();
  });
});
