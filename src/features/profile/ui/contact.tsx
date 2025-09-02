import Link from "next/link";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { RiNotionFill } from "react-icons/ri";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

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
      <h2 className="my-0.5 font-bold text-3xl">연락처</h2>
      <p>dbsdndwo12@gmail.com</p>
      <ul className="my-2 flex gap-1">
        {LINKS.map((link) => (
          <Tooltip key={link.url}>
            <TooltipTrigger>
              <Link
                href={link.url}
                target="_blank"
                rel="noreferer"
                className="text-5xl hover:text-blue-500"
              >
                {link.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </ul>
    </article>
  );
}
