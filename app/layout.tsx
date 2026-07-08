import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import Link from "next/link";
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
  verification: {
    other: {
      'google-adsense-account': ['ca-pub-3353800304822117'],
    },
  },
};

const navLinks = [
  { label: "Calculators", href: "/calculators" },
  { label: "About", href: "/about" },
];

const footerCalculators = [
  { label: "SIP Calculator", href: "/calculators/sip-calculator" },
  { label: "Step-Up SIP", href: "/calculators/step-up-sip-calculator" },
  { label: "EMI Calculator", href: "/calculators/emi-calculator" },
  { label: "FD Calculator", href: "/calculators/fd-calculator" },
  { label: "SWP Calculator", href: "/calculators/swp-calculator" },
  { label: "Retirement Calculator", href: "/calculators/retirement-calculator" },
  { label: "NPS Calculator", href: "/calculators/nps-calculator" },
  { label: "STP Calculator", href: "/calculators/stp-calculator" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
       <head>
         <link
             rel="stylesheet"
             href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
           />
           {/* ── Google AdSense ── */}
        {/* <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3353800304822117"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        /> */}
        </head>
      <body className="min-h-full flex flex-col">

        

        {/* ── Header ── */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-375 items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Plan<span className="text-sky-600">My</span>Corpus
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/calculators/sip-calculator"
                className="ml-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Page content ── */}
        <div className="flex flex-1 flex-col">{children}</div>

        {/* ── Footer ── */}
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-375 px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

              {/* Brand */}
              <div className="lg:col-span-1">
                <Link href="/" className="text-lg font-bold text-slate-900">
                  Plan<span className="text-sky-600">My</span>Corpus
                </Link>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Free financial calculators for SIP, EMI, FD, SWP, STP, NPS,
                  and retirement planning — with real-time charts and practical
                  assumptions.
                </p>
              </div>

              {/* Calculators */}
              <div>
                <p className="text-sm font-semibold text-slate-900">Calculators</p>
                <ul className="mt-4 space-y-2">
                  {footerCalculators.slice(0, 4).map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="text-sm text-slate-500 hover:text-slate-900 transition">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">&nbsp;</p>
                <ul className="mt-4 space-y-2">
                  {footerCalculators.slice(4).map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="text-sm text-slate-500 hover:text-slate-900 transition">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <p className="text-sm font-semibold text-slate-900">Company</p>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/about" className="text-sm text-slate-500 hover:text-slate-900 transition">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="text-sm text-slate-500 hover:text-slate-900 transition">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculators" className="text-sm text-slate-500 hover:text-slate-900 transition">
                      All Calculators
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} PlanMyCorpus. All rights reserved.
              </p>
              <p className="text-xs text-slate-400">
                For informational purposes only. Not financial advice.
              </p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}

