import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Popular Calculators",
  description:
    "Explore PlanMyCorpus calculators for SIP, Step Up SIP, FD, EMI, SWP, STP, Retirement, and NPS with fast results and easy-to-understand charts.",
};

const calculators = [
  { name: "SIP", slug: "sip-calculator", status: "Live", description: "Project your recurring mutual fund investment with weekly, monthly, or yearly compounding and an optional lump sum." },
  { name: "Step Up SIP", slug: "step-up-sip-calculator", status: "Live", description: "Model a growing SIP where your monthly contribution increases by a fixed percentage every year." },
  { name: "Fixed Deposit (FD)", slug: "fd-calculator", status: "Live", description: "Calculate FD maturity value with monthly compounding and an optional monthly top-up on your principal." },
  { name: "EMI", slug: "emi-calculator", status: "Live", description: "Find your exact monthly EMI and see the full principal vs interest breakup year by year." },
  { name: "SWP", slug: "swp-calculator", status: "Live", description: "Plan regular monthly withdrawals from your corpus and check how long your investment will sustain them." },
  { name: "STP", slug: "stp-calculator", status: "Live", description: "Simulate moving money from a source fund to a target fund each month and track both portfolios." },
  { name: "Retirement", slug: "retirement-calculator", status: "Live", description: "Estimate the corpus your current savings rate will build and see the inflation-adjusted real value at retirement." },
  {
    name: "National Pension Scheme (NPS)",
    slug: "nps-calculator",
    status: "Live",
    description: "Forecast your NPS maturity corpus, tax-free lump sum withdrawal, and estimated monthly pension.",
  },
];

export default function CalculatorHubPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-3 py-12 sm:px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        Financial calculators
      </h1>
      <p className="mt-3 max-w-3xl text-slate-700">
        All eight calculators are free, require no login, and update in real time as you move the sliders. Each one is built around the actual formulas used in practice — so the projections are as close to reality as your assumptions allow. Pick any calculator below to get started.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((item) => {
          const isLive = item.status === "Live";
          return (
            <article
              key={item.slug}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {item.status}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                {item.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              {isLive ? (
                <Link
                  href={`/calculators/${item.slug}`}
                  className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Open calculator
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Which calculator should I start with?</h2>
        <div className="mt-4 space-y-4 text-slate-700 text-sm leading-7">
          <p>
            If you&apos;re new to investing and want to understand how mutual fund SIPs work, start with the <Link href="/calculators/sip-calculator" className="font-medium text-sky-700 hover:underline">SIP Calculator</Link>. It covers the basics of compounding clearly and lets you see the impact of different return rates and time horizons side by side.
          </p>
          <p>
            If you already have a running SIP and expect salary increases every year, the <Link href="/calculators/step-up-sip-calculator" className="font-medium text-sky-700 hover:underline">Step Up SIP Calculator</Link> is worth a look. Increasing your SIP by even 10% annually can more than double the final corpus compared to a fixed SIP over 20 years.
          </p>
          <p>
            For loan planning — home loans, car loans, or personal loans — the <Link href="/calculators/emi-calculator" className="font-medium text-sky-700 hover:underline">EMI Calculator</Link> gives you the full amortisation picture: exact monthly payment, total interest cost, and year-by-year principal versus interest breakup.
          </p>
          <p>
            If you&apos;re thinking about retirement, use the <Link href="/calculators/retirement-calculator" className="font-medium text-sky-700 hover:underline">Retirement Calculator </Link> to see whether your current savings rate is on track — and critically, what that corpus will actually be worth in today&apos;s money after inflation.
          </p>
        </div>
      </section>
    </main>
  );
}
