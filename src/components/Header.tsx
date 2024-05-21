import Link from "next/link";

type Menu = {
  url: string;
  name: string;
};

const menus: Menu[] = [
  {
    url: "/about",
    name: "about",
  },
  {
    url: "/contact",
    name: "contact",
  },
  {
    url: "/posts",
    name: "posts",
  },
];

export default function Header() {
  return (
    <header className="bg-white h-48 flex justify-between items-center p-8 box-border">
      <Link className="clickable" href="/">
        <h1>Metis Blog</h1>
      </Link>
      <nav className="flex gap-16 clickable">
        {menus.map(({ name, url }) => (
          <Link key={name} href={url}>
            {name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
