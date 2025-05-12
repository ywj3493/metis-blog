"use client";

import type { Tag } from "@/entities/posts/model";
import { TagChip, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import type { Dispatch, SetStateAction } from "react";

type LNBProps = {
  tags: Tag[];
  selectedTags: Set<string>;
  setSelectedTags: Dispatch<SetStateAction<Set<string>>>;
};

export function TagFilter({ tags, selectedTags, setSelectedTags }: LNBProps) {
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
    <div className="sticky top-0 mt-8 flex h-min w-200 flex-col items-center gap-4">
      <Tooltip>
        <TooltipTrigger>
          <div className="cursor-default border-blue-200 border-b-2 px-8">
            태그
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>태그를 여러개 선택할 수 있습니다. or 조건으로 검색됩니다.</p>
        </TooltipContent>
      </Tooltip>
      <div className="grid max-h-[900px] grid-cols-1 gap-4 overflow-y-auto px-2 py-4 text-center">
        {tags.map(({ id, name, color }) => (
          <TagChip
            key={id}
            id={id}
            name={name}
            color={color}
            notSelected={!selectedTags.has(id)}
            onClick={handleTagClick}
          />
        ))}
      </div>
    </div>
  );
}
