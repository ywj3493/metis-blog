import { getNotionPosts } from "@/features/notion/model";
import { Post } from "@/features/posts/model";

let cachedSlugMap: Record<string, string> | null = null;
let lastFetchedAt = 0;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const TTL = 1000 * 60 * 3; // 3분, ISR 주기와 통일

export async function getSlugMap() {
  const now = Date.now();

  if (cachedSlugMap && now - lastFetchedAt < TTL) {
    return cachedSlugMap;
  }

  const isVercelBuild =
    process.env.VERCEL === "1" &&
    process.env.NEXT_PHASE === "phase-production-build";

  if (isVercelBuild) {
    console.log("[BUILD MODE] Using Notion API directly.");
    const posts = (await getNotionPosts()).map(Post.create);

    cachedSlugMap = posts.reduce(
      (acc, { id, slugifiedTitle }) => {
        acc[slugifiedTitle] = id;
        return acc;
      },
      {} as Record<string, string>,
    );
  } else {
    console.log("[RUNTIME] Fetching slugMap from API...");
    const res = await fetch(`${BASE_URL}/api/slugs`);
    if (!res.ok) throw new Error("Failed to fetch slug map");
    cachedSlugMap = await res.json();
  }
  lastFetchedAt = now;
  return cachedSlugMap;
}
