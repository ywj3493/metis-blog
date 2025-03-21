"use client";

import { Tag } from "@/features/posts/model";
import { TagChip, Tooltip } from "@/shared/ui";
import { Dispatch, SetStateAction } from "react";

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
    <div className="flex flex-col w-200 gap-4 items-center sticky top-0 h-min mt-8">
      <Tooltip message="태그를 여러개 선택할 수 있습니다. or 조건으로 검색됩니다.">
        <div className="border-b-2 border-blue-200 px-8 cursor-default">
          Tags
        </div>
      </Tooltip>
      <div className="grid grid-cols-2 gap-4 text-center ">
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
