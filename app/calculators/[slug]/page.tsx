import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OtherCalculator from "@/components/other-calculator";
import PopularCalculatorsLinks from "@/components/popular-calculators-links";
import {
  OTHER_CALCULATOR_BY_SLUG,
  OTHER_CALCULATORS,
  type OtherCalculatorConfig,
} from "@/lib/other-calculators";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function buildFaqSchema(config: OtherCalculatorConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateStaticParams() {
  return OTHER_CALCULATORS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calculator = OTHER_CALCULATOR_BY_SLUG[slug];

  if (!calculator) {
    return {};
  }

  return {
    title: calculator.title,
    description: calculator.shortDescription,
    keywords: [
      calculator.title.toLowerCase(),
      `${calculator.title.toLowerCase()} india`,
      "financial calculator",
      "investment calculator",
    ],
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const calculator = OTHER_CALCULATOR_BY_SLUG[slug];

  if (!calculator) {
    notFound();
  }

  const faqSchema = buildFaqSchema(calculator);

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
          <li className="text-slate-900">{calculator.title}</li>
        </ol>
      </nav>

      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          {calculator.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-700 md:text-lg">
          {calculator.intro}
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
        <OtherCalculator calculatorId={calculator.id} />
        <PopularCalculatorsLinks currentPath={`/calculators/${calculator.slug}`} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
        <p className="mt-3 text-slate-700">{calculator.formulaText}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="mt-4 space-y-4 text-slate-700">
          {calculator.faqs.map((faq) => (
            <article key={faq.question}>
              <h3 className="font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-1">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
