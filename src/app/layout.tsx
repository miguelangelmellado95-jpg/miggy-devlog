import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "miggy.log",
  description: "Software engineer building games, tools & experiments. Build fast. Ship often. Learn in public.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-200">
        <ClientThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
