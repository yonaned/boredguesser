import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://boredguesser.yosen.me"), // change it with your actual domain latter after purchase
  title: "BoredGuesser",
  description:
    "BoredGuesser is a fun and addictive game that challenges your guessing skills. Test your knowledge, compete with friends, and have a blast!",
  openGraph: {
    title: "BoredGuesser",
    description:
      "BoredGuesser is a fun and addictive game that challenges your guessing skills. Test your knowledge, compete with friends, and have a blast!",
    url: "https://boredguesser.yosen.me",
    siteName: "BoredGuesser",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "BoredGuesser - Test your guessing skills",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BoredGuesser",
    description:
      "BoredGuesser is a fun and addictive game that challenges your guessing skills. Test your knowledge, compete with friends, and have a blast!",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}