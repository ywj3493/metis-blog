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

export default function Contact() {
  return (
    <>
      <h2 className="text-3xl font-bold my-2">연락처</h2>
      <p>dbsdndwo12@gmail.com</p>
      <ul className="flex gap-4 my-8">
        {LINKS.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noreferer"
            className="text-5xl hover:text-blue-500"
          >
            {link.icon}
          </a>
        ))}
      </ul>
    </>
  );
}
