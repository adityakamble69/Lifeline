"use client";

import Link from "next/link";
import { Droplet } from "lucide-react";
import { useTranslation } from "@/components/providers";

export function PublicFooter() {
  const t = useTranslation();

  const columns = [
    {
      title: t("footer.platform"),
      links: [
        { href: "/find-blood", label: t("footer.findBlood") },
        { href: "/camps", label: t("footer.camps") },
        { href: "/become-a-donor", label: t("footer.becomeDonor") },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { href: "/about", label: t("footer.about") },
        { href: "/contact", label: t("footer.contact") },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "/privacy", label: t("footer.privacy") },
        { href: "/terms", label: t("footer.terms") },
      ],
    },
  ];

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
            {t("footer.tagline")}
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
        © {new Date().getFullYear()} Lifeline Blood Donor Network.{" "}
        {t("footer.rights")}
      </div>
    </footer>
  );
}