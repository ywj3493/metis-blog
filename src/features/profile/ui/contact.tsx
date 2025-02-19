import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { RiNotionFill } from "react-icons/ri";
import Link from "next/link";
import { Tooltip } from "@/shared/ui";

const LINKS = [
  {
    icon: <AiFillGithub />,
    url: "https://github.com/ywj3493",
    tooltip: "github 주소",
  },
  {
    icon: <AiFillLinkedin />,
    url: "https://www.linkedin.com/in/%EC%9B%85%EC%9E%AC-%EC%9C%A4-aa086a291/",
    tooltip: "linkedin 주소",
  },
  {
    icon: <RiNotionFill />,
    url: "https://metti.notion.site/Woongjae-Yoon-711e48e7a8024004b3c0d1258441b322?pvs=4",
    tooltip: "notion 자기소개서 주소",
  },
];

export function Contact() {
  return (
    <article className="flex flex-col items-center">
      <h2 className="text-3xl font-bold my-2">연락처</h2>
      <p>dbsdndwo12@gmail.com</p>
      <ul className="flex gap-4 my-8">
        {LINKS.map((link) => (
          <Tooltip key={link.url} message={link.tooltip}>
            <Link
              href={link.url}
              target="_blank"
              rel="noreferer"
              className="text-5xl hover:text-blue-500"
            >
              {link.icon}
            </Link>
          </Tooltip>
        ))}
      </ul>
    </article>
  );
}
