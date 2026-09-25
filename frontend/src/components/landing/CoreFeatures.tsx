import Link from "next/link";
import { Droplet, CalendarDays, Megaphone, UserPlus } from "lucide-react";

const features = [
  {
    icon: Droplet,
    title: "Find Blood",
    description: "Get help or help someone in need.",
    href: "/find-blood",
    accent: "bg-primary-light text-primary",
  },
  {
    icon: CalendarDays,
    title: "Blood Donation Camps",
    description: "Discover and register for upcoming camps.",
    href: "/camps",
    accent: "bg-blue-light text-blue",
  },
  {
    icon: Megaphone,
    title: "Spread Awareness",
    description: "Encourage others to donate and save lives.",
    href: "/about",
    accent: "bg-orange-light text-orange",
  },
  {
    icon: UserPlus,
    title: "Register as a Donor",
    description: "Join a growing community of life savers.",
    href: "/become-a-donor",
    accent: "bg-green-light text-green",
  },
];

export function CoreFeatures() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            What we do
          </p>
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            Everything you need to{" "}
            <span className="text-primary">save a life</span>
          </h2>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">
            From finding a donor to organizing a camp — Lifeline brings the
            whole community together on one platform.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                href={f.href}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] sm:p-7"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${f.accent}`}
                  aria-hidden
                >
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-navy">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary">
                    {f.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}