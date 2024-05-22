"use client";

import Image from "next/image";
import { NotionRenderer } from "react-notion-x";
import "react-notion-x/src/styles.css";

const ClientNotionRenderer = ({ recordMap }: { recordMap: any }) => {
  return (
    <NotionRenderer
      recordMap={recordMap}
      components={{
        nextImage: Image,
      }}
      fullPage={true}
      darkMode={false}
      disableHeader
    />
  );
};

export default ClientNotionRenderer;
