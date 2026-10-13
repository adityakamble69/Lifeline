import Link from "next/link";
import { Droplet } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/find-blood", label: "Find Blood" },
      { href: "/camps", label: "Camps" },
      { href: "/become-a-donor", label: "Become a Donor" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-navy">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Droplet className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg">Lifeline</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-text-secondary">
            Connecting blood donors, requesters, and donation camps on one
            trusted platform.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-navy">{col.title}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-4 py-5 text-center text-xs text-text-secondary sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Lifeline Blood Donor Network. All rights
        reserved.
      </div>
    </footer>
  );
}