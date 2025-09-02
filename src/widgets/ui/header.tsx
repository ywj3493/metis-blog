import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/entities/theme/ui";

type Menu = {
  url: string;
  name: string;
};

const MENUS: Menu[] = [
  {
    url: "/about",
    name: "소개",
  },
  {
    url: "/guestbooks",
    name: "방명록",
  },
  {
    url: "/posts",
    name: "포스트",
  },
];

export function Header() {
  return (
    <header className="box-border flex items-center justify-between px-6 py-4">
      <Link className="clickable flex items-center gap-1" href="/">
        <Image src={"/mascot.png"} height={48} width={48} alt={"icon"} />
        <h1 className="font-bold text-2xl">{"메티의 블로그"}</h1>
      </Link>
      <nav className="clickable flex gap-4">
        {MENUS.map(({ name, url }) => (
          <Link key={name} href={url}>
            {name}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
