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
      name: "What is a SIP calculator and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A SIP calculator estimates the future value of recurring mutual fund investments. You enter your monthly amount, expected annual return, and investment duration. The calculator compounds your contributions at the chosen frequency and adds any one-time lump sum to project a final corpus.",
      },
    },
    {
      "@type": "Question",
      name: "What formula does this SIP calculator use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The calculator uses a period-by-period compounding simulation. Each period it applies: corpus = (corpus + periodicInvestment) × (1 + r), where r is the return rate per period. For monthly investments r = annualReturn/12/100. Any lump sum is placed at the start and compounds through all periods.",
      },
    },
    {
      "@type": "Question",
      name: "Can SIP returns be guaranteed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. SIP returns are market-linked. The calculator gives an estimate based on the assumptions you provide. Actual returns depend on market performance and fund selection.",
      },
    },
    {
      "@type": "Question",
      name: "Why does duration matter so much in SIP investing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Longer duration gives compounding more time to work. A ₹10,000 monthly SIP at 12% return builds about ₹23 lakh in 10 years, ₹99 lakh in 20 years, and around ₹3.5 crore in 30 years. The corpus doesn't grow linearly — it accelerates. The last 10 years of a 30-year SIP add far more than the first 10.",
      },
    },
    {
      "@type": "Question",
      name: "What frequencies does this SIP calculator support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can choose weekly, monthly, or yearly SIP frequencies. Monthly is the standard for most mutual fund platforms. Weekly SIP gives slightly better results than monthly because money is invested more frequently, leaving less idle. The difference is small but measurable over long horizons.",
      },
    },
    {
      "@type": "Question",
      name: "How does the lump sum option work in SIP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The lump sum is treated as an initial one-time investment placed at the start of the SIP. It compounds across the full duration alongside your recurring contributions. Adding a lump sum is useful if you have existing savings you want to deploy while also starting a new SIP.",
      },
    },
    {
      "@type": "Question",
      name: "Is this investment advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. This is a projection tool, not investment advice. Real outcomes depend on market performance, fund selection, and economic conditions. Always consult a SEBI-registered investment advisor before making financial decisions.",
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
          A Systematic Investment Plan (SIP) is arguably the most practical way most people build real wealth over time — not because of any magic, but because it removes the need to time the market and turns investing into a habit. This calculator lets you project your corpus with full control over frequency (weekly, monthly, or yearly), an optional one-time lump sum, expected annual return, and investment duration.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
        <SipCalculator />
        <PopularCalculatorsLinks currentPath="/calculators/sip-calculator" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">How it works — the formula</h2>
        <p className="mt-3 text-slate-700">
          The standard closed-form SIP future value formula is:
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-5">
          <pre className="font-mono text-sm leading-relaxed text-slate-800">{`Standard SIP formula:
         P × [(1 + r)ⁿ − 1]
  FV  =  ──────────────────── × (1 + r)
                  r

where  P = Periodic investment amount
       r = Return per period (Annual Rate / periods per year / 100)
       n = Total number of investment periods`}</pre>
        </div>
        <p className="mt-3 text-slate-700">
          However, a closed-form formula cannot cleanly handle variable frequencies (weekly, monthly, yearly) alongside a lump sum in one expression. So this calculator uses a period-by-period simulation instead:
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-5">
          <pre className="font-mono text-sm leading-relaxed text-slate-800">{`Each period:
  Corpus = (Corpus + Periodic Contribution) × (1 + r)

where  r = Annual Return / 12 / 100   (monthly SIP)
       r = Annual Return / 52 / 100   (weekly SIP)
       r = Annual Return / 1  / 100   (yearly SIP)

Any lump sum is added to Corpus at period zero.`}</pre>
        </div>
        <p className="mt-3 text-slate-700">
          The chart splits the final corpus into what you physically invested (contributions + lump sum) and the gains generated purely by compounding. That split shows how much came from discipline versus how much came from compound growth — usually the two are roughly equal after 15–20 years, and growth dominates beyond 25 years.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="mt-4 space-y-5 text-slate-700">
          <article>
            <h3 className="font-semibold text-slate-900">What is a SIP calculator and how does it help?</h3>
            <p className="mt-1">
              A SIP calculator projects how much your regular investments will grow to, given a return assumption and a time horizon. It&apos;s not a guarantee — markets fluctuate — but it gives you a concrete number to plan around. If your target corpus for a goal is ₹1 crore and the calculator shows you need ₹8,000 per month at 12% for 20 years, you have an actionable starting point.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">What formula does this SIP calculator use?</h3>
            <p className="mt-1">
              The calculator simulates each period individually rather than using the standard closed-form SIP formula. Each period: <strong>corpus = (corpus + contribution) × (1 + r)</strong>, where r is the return per period (annual rate ÷ 12 for monthly, ÷ 52 for weekly, ÷ 1 for yearly). This approach naturally handles lump sums, variable frequencies, and long horizons without approximation errors.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">Which SIP frequency is best — weekly, monthly, or yearly?</h3>
            <p className="mt-1">
              More frequent investments slightly outperform less frequent ones because each contribution starts compounding sooner. Weekly SIP will produce a marginally higher corpus than monthly SIP for the same annual investment amount. In practice, most Indian mutual funds support monthly SIPs as the standard, so monthly is the most practical choice for most people.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">How does the optional lump sum affect the final corpus?</h3>
            <p className="mt-1">
              The lump sum is invested at the very start and compounds across the full duration. A ₹1 lakh lump sum at 12% annual return for 20 years grows to roughly ₹9.6 lakh on its own — without any SIP. Combined with a regular SIP, the lump sum has a compounding tail that grows proportionally with the duration. Longer the horizon, more meaningful the lump sum contribution to the final corpus.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">What return rate should I use for projections?</h3>
            <p className="mt-1">
              For diversified large-cap equity mutual funds, 10–12% annual return is a common planning assumption based on long-term historical Indian market averages. Mid-cap or small-cap funds have historically averaged higher but with significantly more volatility. For conservative planning, use 10%. The important thing is to not over-assume — using 18–20% in projections sets expectations that are hard to meet consistently.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">What are the maximum limits in this calculator?</h3>
            <p className="mt-1">
              You can set annual return up to 50% and investment duration up to 70 years. These extended limits exist for stress-testing scenarios — for example, NRI investors with longer time horizons, or comparing aggressive versus conservative return assumptions at extremes. For typical retirement planning, 10–12% return and 20–30 years are the practical sweet spot.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">Does this show me how much I need to invest to reach a specific goal?</h3>
            <p className="mt-1">
              The calculator works in the forward direction — enter your investment amount and see the resulting corpus. To work backwards (target corpus → required SIP), you can experiment by adjusting the monthly SIP slider until the projected corpus matches your goal. A quick mental formula: for 12% annual return, every ₹1,000 of monthly SIP for 20 years produces roughly ₹9.9 lakh.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">Is the projection on this tool investment advice?</h3>
            <p className="mt-1">
              No. This is a projection tool only. Market returns are not predictable, and actual fund performance will differ from any assumed rate. Use these projections for planning and scenario comparison, not as expected returns. For personalised investment advice, consult a SEBI-registered investment advisor.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
