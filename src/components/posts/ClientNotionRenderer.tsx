"use client";

import Image from "next/image";
import { NotionRenderer } from "react-notion-x";
import { Code } from "react-notion-x/build/third-party/code";
import { Collection } from "react-notion-x/build/third-party/collection";
import "react-notion-x/src/styles.css";

const ClientNotionRenderer = ({ recordMap }: { recordMap: any }) => {
  return (
    <NotionRenderer
      recordMap={recordMap}
      components={{
        nextImage: Image,
        Code: Code,
        Collection: Collection,
      }}
      fullPage={true}
      darkMode={false}
      disableHeader
    />
  );
};

export default ClientNotionRenderer;
