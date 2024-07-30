"use client";

import { useTheme } from "next-themes";

type TagChipProps = {
  id: string;
  name: string;
  color: string;
  notSelected?: boolean;
  onClick?: (id: string) => void;
};

export default function TagChip({
  id,
  name,
  color,
  notSelected,
  onClick,
}: TagChipProps) {
  const { theme } = useTheme();

  const defaultBg = theme === "dark" ? "black" : "white";
  const defaultText = theme === "dark" ? "white" : "black";

  const convertedBg =
    color === "default" ? "gray" : color === "brown" ? "red" : color;

  const dynamicBgColor = notSelected
    ? `bg-${defaultBg}-100`
    : `bg-${convertedBg}-100`;

  const dynamicTextColor = notSelected ? `text-${defaultText}` : "text-black";

  const handleTagClick = () => {
    onClick?.(id);
  };

  return (
    <div
      className={`${dynamicBgColor} ${dynamicTextColor} py-4 px-12 text-12  rounded-4 clickable`}
      onClick={handleTagClick}
    >
      {name}
    </div>
  );
}
