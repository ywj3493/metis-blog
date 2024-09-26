import Contact from "@/components/about/Contact";
import ClientNotionRenderer from "@/components/posts/ClientNotionRenderer";
import { getNotionAboutPage } from "@/services/_external";
import { Metadata } from "next";

export const revalidate = 180;

export const metadata: Metadata = {
  title: "about",
  description: "메티 소개글",
};

export default async function AboutPage() {
  const pageRecordMap = await getNotionAboutPage();

  return (
    <section className="flex flex-col items-center gap-16">
      <ClientNotionRenderer recordMap={pageRecordMap} />
      <Contact />
    </section>
  );
}
