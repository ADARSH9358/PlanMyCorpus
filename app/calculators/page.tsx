import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Popular Calculators",
  description:
    "Explore PlanMyCorpus calculators for SIP, Step Up SIP, FD, EMI, SWP, STP, Retirement, and NPS with fast results and easy-to-understand charts.",
};

const calculators = [
  { name: "SIP", slug: "sip-calculator", status: "Live" },
  { name: "Step Up SIP", slug: "step-up-sip-calculator", status: "Live" },
  { name: "Fixed Deposit (FD)", slug: "fd-calculator", status: "Live" },
  { name: "EMI", slug: "emi-calculator", status: "Live" },
  { name: "SWP", slug: "swp-calculator", status: "Live" },
  { name: "STP", slug: "stp-calculator", status: "Live" },
  { name: "Retirement", slug: "retirement-calculator", status: "Live" },
  {
    name: "National Pension Scheme (NPS)",
    slug: "nps-calculator",
    status: "Live",
  },
];

export default function CalculatorHubPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-3 py-12 sm:px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        Popular calculators
      </h1>
      <p className="mt-3 max-w-3xl text-slate-700">
        Use these calculators to compare investment and loan scenarios. Start
        with SIP as the working reference implementation.
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
    </main>
  );
}
