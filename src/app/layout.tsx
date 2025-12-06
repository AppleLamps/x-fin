import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavRail, Header } from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X-Fin | Market Intelligence Dashboard",
  description: "AI-powered market intelligence and stock analysis powered by xAI Grok",
  keywords: ["stocks", "market", "finance", "AI", "analysis", "trading"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <div className="flex min-h-screen">
          {/* Left Navigation Rail */}
          <NavRail />

          {/* Main Content Area */}
          <div className="flex-1 ml-16 lg:ml-56 transition-all duration-300 overflow-x-hidden">
            <Header />
            <main className="min-h-[calc(100vh-3.5rem)] overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
