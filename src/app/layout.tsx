import { Inter } from "next/font/google";
import { MSWStarter } from "@/mocks/component";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

import "./globals.css";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex flex-col w-full max-w-screen-xl mx-auto">
        <MSWStarter>
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </MSWStarter>
      </body>
    </html>
  );
}
