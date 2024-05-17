"use client";

import { useState } from "react";

export default function PostCard() {
  const [state, setState] = useState(0);

  return (
    <div
      onClick={() => setState((prev) => prev + 1)}
    >{`view count: ${state}`}</div>
  );
}
