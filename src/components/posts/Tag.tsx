"use client";

type TagProps = {
  id: string;
  name: string;
  color: string;
  notSelected?: boolean;
  onClick?: (id: string) => void;
};

export default function Tag({
  id,
  name,
  color,
  notSelected,
  onClick,
}: TagProps) {
  const convertedColor = notSelected
    ? "white"
    : color === "default"
    ? "gray"
    : color === "brown"
    ? "red"
    : color;

  const dynamicClass =
    color === "blue" ? `bg-${convertedColor}` : `bg-${convertedColor}-100`;

  const handleTagClick = () => {
    onClick?.(id);
  };

  return (
    <div
      className={`${dynamicClass} bg- py-4 px-12 text-12 rounded-4 clickable`}
      onClick={handleTagClick}
    >
      {name}
    </div>
  );
}
