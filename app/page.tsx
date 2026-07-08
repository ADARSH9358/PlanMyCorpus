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

    </main>
  );
}
