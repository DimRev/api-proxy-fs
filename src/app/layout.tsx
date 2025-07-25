import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import SearchHistoryList from "~/features/search/components/SearchHistoryList";

export const metadata: Metadata = {
  title: "Api Proxy",
  description: "A simple API proxy with search history",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <div className="flex h-dvh w-dvw flex-col overflow-hidden bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <TRPCReactProvider>
            <main className="flex h-full grow justify-between">
              <div className="h-full flex-9/12">{children}</div>
              <SearchHistoryList className="flex-3/12" />
            </main>
          </TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
