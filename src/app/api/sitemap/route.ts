import { getNotionPosts } from "@/features/notion/model";
import { Post } from "@/features/posts/model";
import type { MetadataRoute } from "next";

export async function GET() {
  const baseUrl = process.env.BLOG_URL || "";

  const posts = (await getNotionPosts()).map(Post.create);
  const postUrls: MetadataRoute.Sitemap = posts.map(
    ({ slugifiedTitle, lastEditedTime }) => ({
      url: `${baseUrl}/posts/${slugifiedTitle}`,
      lastModified: new Date(lastEditedTime),
      changeFrequency: "daily",
      priority: 0.8,
    }),
  );

  const sitemapList = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guestbooks`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
    ...postUrls,
  ];

  const formatDate = (date: Date) => date.toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapList
      .map(({ url, lastModified, changeFrequency, priority }) => {
        return `
          <url>
            <loc>${url}</loc>
            <lastmod>${formatDate(new Date(lastModified as string))}</lastmod>
            <changefreq>${changeFrequency}</changefreq>
            <priority>${priority}</priority>
          </url>
        `;
      })
      .join("")}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
