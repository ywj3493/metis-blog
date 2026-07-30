import { expect, test } from "@playwright/test";

test.describe("SEO endpoints", () => {
  test("robots.txt is served", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain("User-Agent: *");
    expect(body).toContain("Sitemap:");
  });

  test("sitemap.xml is served as XML with the mock post", async ({
    request,
  }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    expect(res.headers()["content-type"]).toContain("xml");
    const body = await res.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("/posts/ci-mock-post");
  });
});
