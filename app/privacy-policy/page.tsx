import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "PlanMyCorpus Privacy Policy — learn how we handle your data, use cookies, and display ads on our free financial calculator platform.",
};

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Information you provide",
        body: "PlanMyCorpus does not require you to create an account or provide any personal information to use our calculators. We do not collect your name, email address, phone number, or financial details.",
      },
      {
        subtitle: "Automatically collected information",
        body: "When you visit our website, certain technical information may be automatically collected by our hosting provider and analytics tools. This may include your IP address (anonymised), browser type, device type, operating system, pages visited, time spent on pages, and referring URL. This data is used in aggregate form only to understand how our tools are used and to improve the user experience.",
      },
    ],
  },
  {
    id: "cookies",
    title: "2. Cookies and Tracking Technologies",
    content: [
      {
        subtitle: "What are cookies?",
        body: "Cookies are small text files stored on your device by your browser. They help websites remember your preferences and improve performance.",
      },
      {
        subtitle: "How we use cookies",
        body: "We may use cookies for the following purposes: (a) analytics — to understand traffic patterns and page usage; (b) advertising — third-party ad networks such as Google AdSense may set cookies to serve personalised or contextual advertisements based on your browsing activity.",
      },
      {
        subtitle: "Managing cookies",
        body: "You can control and delete cookies through your browser settings at any time. Note that disabling cookies may affect the functionality of some features. You may also opt out of personalised advertising by visiting Google's Ads Settings at https://adssettings.google.com.",
      },
    ],
  },
  {
    id: "google-adsense",
    title: "3. Google AdSense and Third-Party Advertising",
    content: [
      {
        subtitle: "Third-party ad serving",
        body: "PlanMyCorpus may display advertisements served by Google AdSense and other third-party advertising networks. These networks use cookies and web beacons to serve ads based on your prior visits to our website and other sites on the internet.",
      },
      {
        subtitle: "Data used for advertising",
        body: "Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to our site and/or other sites on the Internet. You may opt out of personalised advertising by visiting Google Ads Settings. Alternatively, you can opt out of a third-party vendor's use of cookies by visiting the Network Advertising Initiative opt-out page.",
      },
      {
        subtitle: "No personal data shared with advertisers",
        body: "We do not share any personally identifiable information with advertisers. Ad networks collect their own data as governed by their own privacy policies.",
      },
    ],
  },
  {
    id: "analytics",
    title: "4. Analytics",
    content: [
      {
        subtitle: "Usage analytics",
        body: "We may use third-party analytics services (such as Google Analytics) to help us understand how visitors interact with our website. These services may collect information about your use of the site, including pages visited, time spent, and actions taken. This data is processed in aggregate and anonymised form. Google Analytics data is governed by Google's Privacy Policy.",
      },
    ],
  },
  {
    id: "third-party-links",
    title: "5. Third-Party Links",
    content: [
      {
        subtitle: null,
        body: "Our website may contain links to external websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policy of any third-party site you visit.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    title: "6. Children's Privacy",
    content: [
      {
        subtitle: null,
        body: "PlanMyCorpus is not directed at children under the age of 13. We do not knowingly collect any personal information from children. If you believe a child has provided us with personal data, please contact us and we will take steps to remove that information.",
      },
    ],
  },
  {
    id: "data-security",
    title: "7. Data Security",
    content: [
      {
        subtitle: null,
        body: "We take reasonable technical and organisational measures to protect any data processed in connection with your use of our website. However, no method of transmission over the Internet is 100% secure. We cannot guarantee the absolute security of any information.",
      },
    ],
  },
  {
    id: "changes",
    title: "8. Changes to This Policy",
    content: [
      {
        subtitle: null,
        body: "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. We will post the revised policy on this page with an updated effective date. We encourage you to review this page periodically.",
      },
    ],
  },
  {
    id: "contact",
    title: "9. Contact Us",
    content: [
      {
        subtitle: null,
        body: "If you have any questions or concerns about this Privacy Policy or how your data is handled, please email us at adarsh@gmail.com. We will respond as soon as possible.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  const effectiveDate = "July 8, 2026";

  return (
    <main className="mx-auto flex w-full max-w-375 flex-1 flex-col gap-10 px-3 py-14 sm:px-4 md:px-6 lg:px-8">

      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          Legal
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Effective date: <span className="font-medium text-slate-700">{effectiveDate}</span>
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          PlanMyCorpus (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to
          protecting your privacy. This Privacy Policy explains what information
          we collect when you use{" "}
          <span className="font-medium text-slate-800">planmycorpus.com</span>,
          how we use it, and your choices regarding that information. By using
          our website, you agree to the practices described in this policy.
        </p>
      </section>

      {/* Table of contents */}
      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:hidden">
        <p className="text-sm font-semibold text-slate-900">Contents</p>
        <ol className="mt-3 space-y-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-sm text-sky-600 hover:underline"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </aside>

      {/* Main content + sticky TOC */}
      <div className="flex gap-8">

        {/* Sticky TOC — desktop only */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Contents</p>
            <ol className="mt-4 space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block text-sm text-slate-500 transition hover:text-sky-600"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* Sections */}
        <div className="flex flex-1 flex-col gap-8">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {section.content.map((block, i) => (
                  <div key={i}>
                    {block.subtitle && (
                      <p className="mb-1 text-sm font-semibold text-slate-700">
                        {block.subtitle}
                      </p>
                    )}
                    <p className="text-sm leading-7 text-slate-600">{block.body}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Disclaimer box */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <p className="text-sm font-semibold text-amber-900">Disclaimer</p>
            <p className="mt-2 text-sm leading-7 text-amber-800">
              PlanMyCorpus is not a financial advisor. All calculators are for
              informational purposes only. Projections are based on user-provided
              inputs and do not account for taxes, charges, or market risk.
              Please consult a qualified financial advisor before making
              investment decisions.
            </p>
          </div>

          {/* Back link */}
          <div className="flex gap-4 pb-4">
            <Link
              href="/"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              ← Back to Home
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
}
