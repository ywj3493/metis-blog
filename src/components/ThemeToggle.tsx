"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MdDarkMode as DarkModeIcon } from "react-icons/md";
import { MdOutlineDarkMode as LightModeIcon } from "react-icons/md";
import { LoadingDot } from "./Loading";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <div className="aspect-square w-24 h-24">
      {mounted ? (
        theme === "light" ? (
          <DarkModeIcon
            onClick={() => setTheme("dark")}
            className="aspect-square w-full h-full"
          />
        ) : (
          <LightModeIcon
            onClick={() => setTheme("light")}
            className="aspect-square w-full h-full"
          />
        )
      ) : (
        <LoadingDot />
      )}
    </div>
  );
}
