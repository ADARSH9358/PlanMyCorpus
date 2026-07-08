import type { Metadata } from "next";
import Link from "next/link";
import PopularCalculatorsLinks from "@/components/popular-calculators-links";
import SipCalculator from "@/components/sip-calculator";

export const metadata: Metadata = {
  title: "SIP Calculator",
  description:
    "Use PlanMyCorpus SIP Calculator to project weekly, monthly, or yearly SIP with optional lump sum, up to 50% return and 70 years, with instant visual charts.",
  keywords: [
    "sip calculator",
    "mutual fund sip calculator",
    "investment growth calculator",
    "sip return calculator",
    "lumpsum sip calculator",
    "weekly sip calculator",
    "yearly sip calculator",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a SIP calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A SIP calculator estimates the future value of recurring investments and optional lump sum based on expected annual return and duration.",
      },
    },
    {
      "@type": "Question",
      name: "Can SIP returns be guaranteed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. SIP returns are market-linked. The calculator gives an estimate based on the assumptions you provide.",
      },
    },
    {
      "@type": "Question",
      name: "Why does duration matter so much?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Longer duration gives compounding more time to grow your corpus. Even small monthly investments can grow significantly over long periods.",
      },
    },
  ],
};

export default function SipCalculatorPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-8 px-3 py-10 sm:px-4 md:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/calculators" className="hover:text-slate-900">
              Calculators
            </Link>
          </li>
          <li>/</li>
          <li className="text-slate-900">SIP Calculator</li>
        </ol>
      </nav>

      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          SIP Calculator
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-700 md:text-lg">
          Plan your systematic investment with clear assumptions and instant
          visual insights. Adjust recurring frequency (weekly, monthly,
          yearly), optional lump sum, expected return, and years to estimate
          your future corpus.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
        <SipCalculator />
        <PopularCalculatorsLinks currentPath="/calculators/sip-calculator" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
        <p className="mt-3 text-slate-700">
          The calculator uses frequency-based compounding for recurring
          investments and includes a one-time lump sum at the start. It
          separates invested amount and wealth gained so you can clearly see the
          impact of time and expected return.
        </p>
        <p className="mt-3 text-slate-700">
          Formula style: corpus is simulated period-by-period using your chosen
          frequency (weekly/monthly/yearly), where each period applies growth
          and adds recurring contribution. Lump sum is added at the beginning
          and compounds across the full duration.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="mt-4 space-y-4 text-slate-700">
          <article>
            <h3 className="font-semibold text-slate-900">What is a SIP calculator?</h3>
            <p className="mt-1">
              A SIP calculator helps estimate the future value of recurring
              mutual fund investments with optional lump sum based on expected
              return and duration.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">Which frequencies are supported?</h3>
            <p className="mt-1">
              You can calculate projections for weekly, monthly, or yearly
              recurring investments, and also include a one-time lump sum.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">What are the maximum limits in this calculator?</h3>
            <p className="mt-1">
              You can set annual return up to 50% and investment duration up to
              70 years to test long-term and high-growth scenarios.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">Is this investment advice?</h3>
            <p className="mt-1">
              No. This is an estimation tool and not investment advice. Real
              outcomes depend on market performance and product selection.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
