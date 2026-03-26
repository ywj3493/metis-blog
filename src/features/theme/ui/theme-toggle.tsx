"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  MdDarkMode as DarkModeIcon,
  MdOutlineDarkMode as LightModeIcon,
} from "react-icons/md";
import { LoadingDot } from "@/shared/ui";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <div className="aspect-square h-6 w-6">
      {mounted ? (
        theme === "light" ? (
          <DarkModeIcon
            onClick={() => setTheme("dark")}
            className="aspect-square h-full w-full"
          />
        ) : (
          <LightModeIcon
            onClick={() => setTheme("light")}
            className="aspect-square h-full w-full"
          />
        )
      ) : (
        <LoadingDot />
      )}
    </div>
  );
}
