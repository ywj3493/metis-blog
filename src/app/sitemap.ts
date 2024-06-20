import { getNotionPosts } from "@/services/_external/notion";
import { MetadataRoute } from "next";

const baseUrl = process.env.BLOG_URL || "";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getNotionPosts();
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.last_edited_time),
    changeFrequency: "daily",
    priority: 0.8,
  }));
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
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
}
