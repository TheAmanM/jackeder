import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jackeder - Gym Accountability for Friends",
  description:
    "Track your gym attendance with friends and stay motivated together",
  openGraph: {
    title: "Jackeder - Gym Accountability for Friends",
    description:
      "Track your gym attendance with friends and stay motivated together",
    url: "https://jackeder.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jackeder - Gym Accountability for Friends",
    description:
      "Track your gym attendance with friends and stay motivated together",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
