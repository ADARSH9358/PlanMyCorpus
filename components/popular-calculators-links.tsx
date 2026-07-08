import Link from "next/link";
import { OTHER_CALCULATORS } from "@/lib/other-calculators";

type PopularCalculatorsLinksProps = {
  currentPath?: string;
};

const sipLink = {
  title: "SIP Calculator",
  href: "/calculators/sip-calculator",
};

const otherLinks = OTHER_CALCULATORS.map((item) => ({
  title: item.title,
  href: `/calculators/${item.slug}`,
}));

const popularLinks = [sipLink, ...otherLinks];

export default function PopularCalculatorsLinks({
  currentPath,
}: PopularCalculatorsLinksProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Popular Calculators</h2>
      <ul className="mt-3 space-y-2">
        {popularLinks.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "block rounded-lg px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
