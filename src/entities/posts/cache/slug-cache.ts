import { slugify } from "@/entities/posts/utils";
import { getNotionPosts } from "@/features/notion/model";

let cachedSlugMap: Record<string, string> | null = null;
let lastFetchedAt = 0;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const TTL = 1000 * 60 * 5; // 5분

function isBuildTime() {
  return !process.env.VERCEL && process.env.NODE_ENV === "production";
}

export async function getSlugMap() {
  const now = Date.now();

  if (cachedSlugMap && now - lastFetchedAt < TTL) {
    return cachedSlugMap;
  }

  if (isBuildTime()) {
    console.log("🔧 [BUILD MODE] Directly calling Notion API for slugMap...");
    const posts = await getNotionPosts();
    cachedSlugMap = posts.reduce(
      (acc, post) => {
        acc[post.id] = encodeURIComponent(
          /* @ts-expect-error Notion Type Error */
          slugify(post.properties.제목.title[0].plain_text),
        );
        return acc;
      },
      {} as Record<string, string>,
    );
    lastFetchedAt = now;
    return cachedSlugMap;
  }

  console.log("🌐 [RUNTIME] Fetching slugMap from API...");
  const res = await fetch(`${BASE_URL}/api/slugs`);
  if (!res.ok) throw new Error("Failed to fetch slug map");
  cachedSlugMap = await res.json();
  lastFetchedAt = now;
  return cachedSlugMap;
}
