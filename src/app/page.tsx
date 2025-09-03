import { FeaturedPosts } from "@/features/posts/ui";
import { Hero } from "@/features/profile/ui";
import { CACHE_CONFIG } from "@/shared/config";

export const revalidate = CACHE_CONFIG.ISR_REVALIDATE_TIME;

export default function HomePage() {
  return (
    <section>
      <Hero />
      <FeaturedPosts />
    </section>
  );
}
