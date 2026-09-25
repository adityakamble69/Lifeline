import Link from "next/link";
import { Users, Droplet, Heart, Building2, ArrowRight } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Registered Donors" },
  { icon: Droplet, value: "250+", label: "Blood Donation Camps" },
  { icon: Heart, value: "8,500+", label: "Lives Saved" },
  { icon: Building2, value: "120+", label: "Hospitals Connected" },
];

export function ImpactStats() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-3xl bg-gradient-to-r from-primary-deep via-primary to-primary-deep px-6 py-10 sm:px-10 lg:px-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3 text-white">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xl font-bold leading-tight sm:text-2xl">
                      {s.value}
                    </p>
                    <p className="text-xs text-white/80 sm:text-sm">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/become-a-donor"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-surface px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
          >
            Become a Donor
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}