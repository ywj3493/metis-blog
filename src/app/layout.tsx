import { Inter } from "next/font/google";
// import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

import "./globals.css";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "메티의 블로그",
    template: "메티의 블로그 | %s",
  },
  description:
    "안녕하세요. 메티입니다. 노션 TIL 에서 작성한 것을 공개하는 블로그 입니다.",
  icons: "icon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.className}
      suppressHydrationWarning={process.env.NODE_ENV === "production"}
    >
      <body className="flex flex-col w-full max-w-screen-xl mx-auto">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="grow">{children}</main>
          {/* <Footer /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
