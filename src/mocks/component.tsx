"use client";

import { useEffect, useState } from "react";
import { enableMocking } from ".";

export function MSWStarter({ children }: { children: React.ReactNode }) {
  const [enableMSW, setEnableMSW] = useState(false);

  useEffect(() => {
    const init = async () => {
      await enableMocking();
      setEnableMSW(true);
    };
    if (!enableMSW) {
      init();
    }
  }, [enableMSW]);

  return enableMSW ? { children } : null;
}
