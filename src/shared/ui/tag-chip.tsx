"use client";

import { useTheme } from "next-themes";

import { cn } from "@/shared/lib/utils";
import { Button } from "./button";

export interface TagChipProps {
  id: string;
  name: string;
  color: string;
  notSelected?: boolean;
  onClick?: (id: string) => void;
}

const TagChip = ({ id, name, color, notSelected, onClick }: TagChipProps) => {
  const { theme } = useTheme();

  const defaultBg = theme === "dark" ? "black" : "white";
  const defaultText = theme === "dark" ? "white" : "black";

  const convertedBg =
    color === "default" ? "gray" : color === "brown" ? "red" : color;

  const dynamicBgColor = notSelected
    ? `bg-${defaultBg}-100`
    : `bg-${convertedBg}-100`;

  const dynamicTextColor = notSelected ? `text-${defaultText}` : "text-black";

  const tagClick = () => {
    onClick?.(id);
  };

  return (
    <Button
      className={cn(
        `${dynamicBgColor} ${dynamicTextColor} clickable h-auto min-h-0 rounded-full px-2 py-0.5 text-xs hover:bg-opacity-80 hover:${dynamicBgColor}`,
      )}
      onClick={tagClick}
    >
      {name}
    </Button>
  );
};
TagChip.displayName = "TagChip";

export { TagChip };
