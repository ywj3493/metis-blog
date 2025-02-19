import { ClientNotionRenderer } from "@/entities/posts/ui";
import { getNotionAboutPage } from "@/features/notion/model";
import { Contact } from "@/features/profile/ui";
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
