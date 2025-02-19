import { ThemeToggle } from "@/entities/theme/ui";
import Image from "next/image";
import Link from "next/link";

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
    name: "게시글",
  },
];

export function Header() {
  return (
    <header className="flex justify-between items-center py-16 px-24 box-border">
      <Link className="clickable flex items-center gap-4" href="/">
        <Image src={"/mascot.png"} height={48} width={48} alt={"icon"} />
        <h1 className="text-2xl font-bold">{"메티의 블로그"}</h1>
      </Link>
      <nav className="flex gap-16 clickable">
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
