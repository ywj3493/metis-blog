import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

type Menu = {
  url: string;
  name: string;
};

const menus: Menu[] = [
  {
    url: "/about",
    name: "소개",
  },
  {
    url: "/guestbooks",
    name: "연락",
  },
  {
    url: "/posts",
    name: "게시글",
  },
];

export default function Header() {
  return (
    <header className="flex justify-between items-center py-16 px-24 box-border">
      <Link className="clickable flex items-center gap-4" href="/">
        <Image src={"/mascot.png"} height={48} width={48} alt={"icon"} />
        <h1 className="text-2xl font-bold">{"메티의 개발 블로그"}</h1>
      </Link>
      <nav className="flex gap-16 clickable">
        {menus.map(({ name, url }) => (
          <Link key={name} href={url}>
            {name}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
