import FeaturedPosts from "@/components/FeaturedPost";
import Hero from "@/components/about/Hero";

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
