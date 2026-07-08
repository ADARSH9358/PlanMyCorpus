import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PlanMyCorpus",
    template: "%s | PlanMyCorpus",
  },
  description:
    "PlanMyCorpus helps you estimate SIP, EMI, FD, retirement, SWP, STP, and NPS outcomes with simple inputs, visual charts, and smart planning insights.",
  keywords: [
    "PlanMyCorpus",
    "sip calculator",
    "investment calculator",
    "emi calculator",
    "financial planning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
