import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about PlanMyCorpus — our mission to make personal financial planning simple, visual, and accessible for everyone.",
};

const values = [
  {
    icon: "🎯",
    title: "Clarity first",
    description:
      "We strip away jargon. Every calculator shows you exactly what the numbers mean — invested amount, returns, and final corpus — side by side.",
  },
  {
    icon: "🔓",
    title: "Always free",
    description:
      "No subscriptions, no sign-ups, no paywalls. Every tool on PlanMyCorpus is and will remain completely free to use.",
  },
  {
    icon: "📊",
    title: "Visual by design",
    description:
      "Charts are not an afterthought — they are the product. Seeing your money grow visually makes long-term planning click in a way tables never do.",
  },
  {
    icon: "⚖️",
    title: "Honest assumptions",
    description:
      "We use realistic default rates and show inflation-adjusted figures wherever they matter. We'd rather give you a conservative estimate than an exciting one.",
  },
];

const tools = [
  { name: "SIP Calculator", href: "/calculators/sip-calculator" },
  { name: "Step-Up SIP Calculator", href: "/calculators/step-up-sip-calculator" },
  { name: "EMI Calculator", href: "/calculators/emi-calculator" },
  { name: "FD Calculator", href: "/calculators/fd-calculator" },
  { name: "SWP Calculator", href: "/calculators/swp-calculator" },
  { name: "Retirement Calculator", href: "/calculators/retirement-calculator" },
  { name: "NPS Calculator", href: "/calculators/nps-calculator" },
  { name: "STP Calculator", href: "/calculators/stp-calculator" },
];

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-375 flex-1 flex-col gap-14 px-3 py-14 sm:px-4 md:px-6 lg:px-8">

      {/* Hero */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          About PlanMyCorpus
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Financial planning tools built for clarity, not complexity.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
          PlanMyCorpus was created with a simple belief: understanding your
          financial future should not require a spreadsheet degree. We build
          free, fast, and visual calculators that help everyday investors in
          India plan their SIP investments, loan EMIs, fixed deposits,
          retirement goals, and more.
        </p>
      </section>

      {/* Mission */}
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Our Mission</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Most people make important financial decisions — starting a SIP,
            taking a home loan, planning retirement — without ever running the
            numbers. Not because they don't want to, but because the tools are
            either locked behind apps, full of ads, or require sign-ups.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Our mission is to remove every barrier between you and your
            financial numbers. Open any calculator, adjust the sliders, and
            instantly see how your money grows — no account, no download, no
            friction.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Who We Are</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            PlanMyCorpus is an independent financial tools platform. We are a
            small team passionate about personal finance, data visualization,
            and making technology genuinely useful for regular people — not just
            those with financial advisors.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            We are not a bank, broker, or financial advisory firm. All
            calculators are educational tools designed to help you understand
            projections based on the inputs you provide. Always consult a
            certified financial advisor before making investment decisions.
          </p>
        </div>
      </section>

      {/* Values */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          What we stand for
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Four principles that guide every calculator we build.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                {v.icon}
              </span>
              <p className="font-semibold text-slate-900">{v.title}</p>
              <p className="text-sm leading-6 text-slate-500">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools we offer */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:p-12">
        <h2 className="text-xl font-semibold text-slate-900">
          Tools we currently offer
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          All calculators are free, require no login, and update in real time.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
              >
                <span className="text-sky-500">→</span>
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:p-10">
        <h2 className="text-xl font-semibold text-slate-900">Contact Us</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          Have a question, suggestion, or feedback? We&apos;d love to hear from you.
          Reach out and we&apos;ll get back to you as soon as possible.
        </p>
        <a
          href="mailto:adarsh.kumar.freelancer@gmail.com"
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        >
          <span><i className="fa-solid fa-envelope"></i></span>
          adarsh.kumar.freelancer@gmail.com
        </a>
      </section>

      {/* Disclaimer */}
      <section className="rounded-3xl bg-amber-50 border border-amber-200 p-8">
        <h2 className="text-base font-semibold text-amber-900">Disclaimer</h2>
        <p className="mt-2 text-sm leading-7 text-amber-800">
          All calculators on PlanMyCorpus are for informational and educational
          purposes only. The projections shown are based solely on the inputs
          you provide and standard mathematical formulas. They do not account
          for taxes, fund expense ratios, market volatility, or individual
          financial circumstances. PlanMyCorpus is not a registered investment
          advisor. Please consult a qualified financial professional before
          making any investment or financial decision.
        </p>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-slate-900 px-8 py-10 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Ready to run your numbers?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
          Pick any calculator and see your financial projections in seconds.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/calculators"
            className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Browse All Calculators
          </Link>
          <Link
            href="/calculators/sip-calculator"
            className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-medium text-white transition hover:border-slate-400"
          >
            Try SIP Calculator
          </Link>
        </div>
      </section>

    </main>
  );
}
