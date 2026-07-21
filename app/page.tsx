import Link from "next/link";

const calculators = [
  {
    title: "SIP Calculator",
    description: "Estimate future wealth from monthly SIP investments with compounding growth charts.",
    href: "/calculators/sip-calculator",
    icon: "📈",
    tag: "Popular",
  },
  {
    title: "Step-Up SIP Calculator",
    description: "Plan a growing SIP strategy where your contribution increases every year.",
    href: "/calculators/step-up-sip-calculator",
    icon: "🚀",
    tag: null,
  },
  {
    title: "EMI Calculator",
    description: "Break down your loan into monthly EMI, principal repaid, and total interest paid.",
    href: "/calculators/emi-calculator",
    icon: "🏦",
    tag: null,
  },
  {
    title: "FD Calculator",
    description: "Project your fixed deposit maturity value with optional monthly top-ups.",
    href: "/calculators/fd-calculator",
    icon: "💰",
    tag: null,
  },
  {
    title: "SWP Calculator",
    description: "Plan systematic withdrawals from your corpus while it continues to grow.",
    href: "/calculators/swp-calculator",
    icon: "💸",
    tag: null,
  },
  {
    title: "Retirement Calculator",
    description: "Estimate the corpus you need to retire comfortably, adjusted for inflation.",
    href: "/calculators/retirement-calculator",
    icon: "🏖️",
    tag: null,
  },
  {
    title: "NPS Calculator",
    description: "Forecast your NPS maturity amount, lumpsum, and estimated monthly pension.",
    href: "/calculators/nps-calculator",
    icon: "🛡️",
    tag: null,
  },
  {
    title: "STP Calculator",
    description: "Simulate systematic transfer of funds from one scheme to another over time.",
    href: "/calculators/stp-calculator",
    icon: "🔄",
    tag: null,
  },
];

const features = [
  {
    icon: "📊",
    title: "Visual Charts",
    description: "Every calculator includes interactive bar and area charts so you can see growth at a glance.",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    description: "Results update in real time as you move the sliders — no submit buttons needed.",
  },
  {
    icon: "🎯",
    title: "Practical Assumptions",
    description: "Sensible defaults based on real-world rates so you get realistic projections from the start.",
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Fully responsive design that works seamlessly on phones, tablets, and desktops.",
  },
];

const stats = [
  { label: "Calculators", value: "8+" },
  { label: "Financial Goals Covered", value: "10+" },
  { label: "Free to Use", value: "100%" },
  { label: "Ads or Sign-up Required", value: "0" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-14 px-3 py-14 sm:px-4 md:px-6 lg:px-8">

      {/* Hero */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          Financial Planning Tools
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Easy calculators with clear visuals and practical assumptions.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 md:text-lg">
          PlanMyCorpus gives you free, no-login financial calculators for SIP, EMI, FD,
          SWP, STP, NPS, and retirement planning — all with real-time charts and
          inflation-aware projections.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/calculators/sip-calculator"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Open SIP Calculator
          </Link>
          <Link
            href="/calculators"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400"
          >
            Browse All Calculators
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-100 pt-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calculator grid */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            All Calculators
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Pick any tool below to get started — no account needed.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
            >
              {calc.tag && (
                <span className="absolute right-4 top-4 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                  {calc.tag}
                </span>
              )}
              <span className="text-3xl">{calc.icon}</span>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-sky-700">
                  {calc.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {calc.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why PlanMyCorpus */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:p-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Why PlanMyCorpus?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Built to remove friction from everyday financial planning decisions.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                {f.icon}
              </span>
              <p className="font-semibold text-slate-900">{f.title}</p>
              <p className="text-sm leading-6 text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="rounded-3xl bg-slate-900 px-8 py-10 text-center md:py-14">
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Start planning your financial future today
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
          All calculators are free, require no sign-up, and update instantly.
          Choose a tool and see your numbers in seconds.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/calculators/sip-calculator"
            className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Try SIP Calculator
          </Link>
          <Link
            href="/calculators"
            className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-medium text-white transition hover:border-slate-400"
          >
            See All Calculators
          </Link>
        </div>
      </section>

      {/* FAQ section */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:p-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Common questions about financial planning
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Answers to questions that come up most often when people start working through the numbers.
        </p>
        <div className="mt-8 space-y-6 text-slate-700">
          <article>
            <h3 className="font-semibold text-slate-900">What is the difference between SIP and lump sum investing?</h3>
            <p className="mt-2 text-sm leading-7">
              A SIP invests a fixed amount at regular intervals — weekly, monthly, or yearly — regardless of market levels. A lump sum puts all your money in at once. SIP has the advantage of rupee cost averaging: you buy more units when prices are low and fewer when prices are high, smoothing out the impact of volatility. Lump sum investing tends to outperform SIP over very long periods when markets trend upward, but requires more comfort with timing risk. Many investors combine both: a lump sum to deploy existing savings and a SIP for ongoing income.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">How does compounding work in practice?</h3>
            <p className="mt-2 text-sm leading-7">
              Compounding means earning returns on your returns, not just on your original investment. At 12% annual return, ₹1 lakh grows to ₹1.12 lakh after year one. In year two you earn 12% on ₹1.12 lakh — not on the original ₹1 lakh — so you get ₹13,440 rather than ₹12,000. This gap between what you earn and what you would have earned at simple interest widens every year. Over 30 years at 12%, ₹1 lakh grows to ₹30 lakh. The last decade of that growth contributes more than the first two decades combined.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">What return rate should I use in these calculators?</h3>
            <p className="mt-2 text-sm leading-7">
              It depends on the asset class. For diversified equity mutual funds, 10–12% per year is a reasonable long-term planning assumption based on Indian market history. For fixed deposits, use the current rate your bank offers (typically 6.5–8%). For NPS, 10% is a common middle-ground. The key is to be honest about assumptions — an optimistic 18% return assumption on an equity fund will produce projections that are almost certainly too high.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">How does inflation affect my financial planning?</h3>
            <p className="mt-2 text-sm leading-7">
              Inflation silently erodes purchasing power. At 6% annual inflation, something that costs ₹100 today will cost ₹179 in 10 years and ₹320 in 20 years. This is why our Retirement Calculator shows an inflation-adjusted corpus figure alongside the nominal one — because the nominal number is misleading for long-term planning. A good rule of thumb: subtract the inflation rate from your expected investment return to get your &quot;real return.&quot; At 12% investment return and 6% inflation, your real return is roughly 6%.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">Is it better to invest in SIP or pay off a loan early?</h3>
            <p className="mt-2 text-sm leading-7">
              Compare the effective rates. If your home loan charges 9% and your equity SIP is expected to return 12%, investing in SIP has a 3% advantage. But if you have a personal loan at 18% or a credit card at 36%, paying those off first is almost always smarter because the guaranteed 18–36% saving from eliminating debt is hard to beat with any investment. Use the EMI Calculator to see your total interest burden and the SIP Calculator to compare scenarios side by side.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">Are these calculators suitable for NRI investors?</h3>
            <p className="mt-2 text-sm leading-7">
              Yes. The underlying mathematics is universal — compounding, amortisation, and corpus projection work the same way regardless of residence status. NRIs investing in Indian mutual funds through NRE or NRO accounts, or through NPS, can use all these calculators with India-specific return and inflation assumptions. The only caveat is that tax treatment for NRIs may differ from residents — consult a tax advisor for jurisdiction-specific guidance.
            </p>
          </article>
          <article>
            <h3 className="font-semibold text-slate-900">Do I need to create an account to use PlanMyCorpus?</h3>
            <p className="mt-2 text-sm leading-7">
              No account or sign-up is needed. Every calculator on PlanMyCorpus is completely free and works directly in your browser. There&apos;s no data stored, no tracking of your inputs, and no registration wall. Just open a calculator, adjust the sliders, and read your results instantly.
            </p>
          </article>
        </div>
      </section>

    </main>
  );
}
