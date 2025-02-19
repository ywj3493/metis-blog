import { FeaturedPosts } from "@/features/posts/ui";
import { Hero } from "@/features/profile/ui";

export const revalidate = 180;

export default function HomePage() {
  return (
    <section>
      <Hero />
      {/* @ts-expect-error Server Component */}
      <FeaturedPosts />
    </section>
  );
}
