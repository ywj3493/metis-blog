import { expect, test } from "@playwright/test";

test.describe("Guestbook page", () => {
  test("renders the guestbook form and contact section", async ({ page }) => {
    await page.goto("/guestbooks");

    await expect(page.getByText("연락처")).toBeVisible();
    await expect(page.getByText("방명록을 남겨주세요.")).toBeVisible();
    await expect(page.getByPlaceholder("이름")).toBeVisible();
    await expect(page.getByPlaceholder("내용")).toBeVisible();
  });

  test("submit button is disabled until the form is valid", async ({
    page,
  }) => {
    await page.goto("/guestbooks");

    const submit = page.getByRole("button", { name: "전송" });
    await expect(submit).toBeDisabled();

    await page.getByPlaceholder("이름").fill("테스터");
    await page.getByPlaceholder("내용").fill("안녕하세요");

    await expect(submit).toBeEnabled();
  });
});
