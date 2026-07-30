import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("renders the hero and featured posts", async ({ page }) => {
    await page.goto("/");

    // Hero section
    await expect(
      page.getByRole("heading", { name: "안녕하세요. 메티입니다." }),
    ).toBeVisible();

    // Featured post from CI_MOCK fixtures
    await expect(page.getByText("CI Mock Post").first()).toBeVisible();
  });

  test("has the site title in the header", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "메티의 블로그" }),
    ).toBeVisible();
  });
});
