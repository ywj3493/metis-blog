import Hero from "@/components/about/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "about",
  description: "메티 소개글",
};

export default function AboutPage() {
  return <Hero />;
}
