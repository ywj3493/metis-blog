import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import Footer from "@/components/Footer";
import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/entities/theme/hooks";
import { Header } from "@/widgets/ui";
import { TooltipProvider } from "@/shared/ui/tooltip";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "메티의 블로그",
    template: "메티의 블로그 | %s",
  },
  description:
    "안녕하세요. 메티입니다. 노션 TIL 에서 작성한 것을 공개하는 블로그 입니다.",
  icons: "/icon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning={process.env.NODE_ENV === "production"}
    >
      <body
        className={`${pretendard.variable} mx-auto flex w-full max-w-screen-xl flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Header />
            <main className="grow">{children}</main>
            {/* <Footer /> */}
          </TooltipProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
