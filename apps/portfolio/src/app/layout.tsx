import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mohd Shahid Iqbal — Frontend Developer",
  description:
    "Distinguished Frontend Developer with 5+ years of experience in React, Next.js, Micro Frontends, and high-performance trading platforms. Available for exciting new opportunities.",
  keywords: [
    "Frontend Developer",
    "React Developer",
    "Next.js",
    "Micro Frontends",
    "TypeScript",
    "Storybook",
    "New Delhi",
    "Mohd Shahid Iqbal",
  ],
  authors: [{ name: "Mohd Shahid Iqbal", url: "https://linkedin.com/in/shahid" }],
  openGraph: {
    title: "Mohd Shahid Iqbal — Frontend Developer",
    description:
      "5+ years building high-performance trading platforms & enterprise web experiences with React, Next.js, and Micro Frontends.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} bg-[#03040a] text-slate-100 antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
