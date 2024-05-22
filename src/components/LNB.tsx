"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Tag from "./posts/Tag";

export type Tag = {
  id: string;
  name: string;
  color: string;
  description: string;
};

type LNBProps = {
  tags: Tag[];
  selectedTags: Set<string>;
  setSelectedTags: Dispatch<SetStateAction<Set<string>>>;
};

export default function LNB({ tags, selectedTags, setSelectedTags }: LNBProps) {
  const handleTagClick = (id: string) => {
    if (selectedTags.has(id)) {
      setSelectedTags((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setSelectedTags((prev) => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });
    }
  };

  return (
    <div className="flex flex-col w-200 gap-4 items-center">
      <div className="border-b-2 border-blue px-8">Tags</div>
      {tags.map(({ id, name, color }) => (
        <Tag
          key={id}
          id={id}
          name={name}
          color={color}
          notSelected={!selectedTags.has(id)}
          onClick={handleTagClick}
        />
      ))}
    </div>
  );
}
