import ContactForm from "@/components/contact/ContactForm";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { RiNotionFill } from "react-icons/ri";

const LINKS = [
  { icon: <AiFillGithub />, url: "" },
  { icon: <AiFillLinkedin />, url: "" },
  { icon: <RiNotionFill />, url: "" },
];

export default function ContactPage() {
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
      <h2 className="text-3xl font-bold">메일로 연락 주세요.</h2>
      <ContactForm />
    </section>
  );
}
