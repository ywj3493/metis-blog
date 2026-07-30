import { expect, test } from "@playwright/test";

test.describe("Header navigation", () => {
  test("navigates to the posts page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "포스트" }).click();
    await expect(page).toHaveURL(/\/posts$/);
    await expect(page.getByText("CI Mock Post").first()).toBeVisible();
  });

  test("navigates to the about page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "소개" }).click();
    await expect(page).toHaveURL(/\/about$/);
    // Contact section is rendered on the about page
    await expect(page.getByText("연락처")).toBeVisible();
  });

  test("navigates to the guestbooks page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "방명록" }).click();
    await expect(page).toHaveURL(/\/guestbooks$/);
    await expect(page.getByText("방명록을 남겨주세요.")).toBeVisible();
  });

  test("logo links back home", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("link", { name: /메티의 블로그/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
