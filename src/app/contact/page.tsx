import ContactForm from "@/components/contact/ContactForm";
import { Metadata } from "next";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { RiNotionFill } from "react-icons/ri";

const LINKS = [
  { icon: <AiFillGithub />, url: "https://github.com/ywj3493" },
  {
    icon: <AiFillLinkedin />,
    url: "https://www.linkedin.com/in/%EC%9B%85%EC%9E%AC-%EC%9C%A4-aa086a291/",
  },
  { icon: <RiNotionFill />, url: "" },
];

export const metadata: Metadata = {
  title: "contact",
  description: "메티에게 메일 보내기",
};

export default async function ContactPage() {
  return (
    <section className="flex flex-col items-center ">
      <h2 className="text-3xl font-bold my-2">Contact Me</h2>
      <p>dbsdndwo12@gmail.com</p>
      <ul className="flex gap-4 my-8">
        {LINKS.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noreferer"
            className="text-5xl hover:text-blue"
          >
            {link.icon}
          </a>
        ))}
      </ul>
      <ContactForm />
    </section>
  );
}
