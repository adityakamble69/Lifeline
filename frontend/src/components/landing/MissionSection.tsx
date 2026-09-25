import Image from "next/image";
import { Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To ensure easy, reliable, and safe access to blood for everyone in need.",
    accent: "bg-primary-light text-primary",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "A future where no life is lost due to the lack of blood donors, and every community is empowered to help.",
    accent: "bg-blue-light text-blue",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "Humanity first, trust & transparency, community driven, safety & responsibility — together we grow.",
    accent: "bg-green-light text-green",
  },
];

export function MissionSection() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.95fr_1fr] lg:gap-14">
        {/* Image */}
        <div className="relative">
          <div className="relative aspect-[4/3] max-h-[440px] overflow-hidden rounded-3xl shadow-[var(--shadow-elevated)]">
            <Image
              src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1200&q=80"
              alt="Community members joining hands for a cause"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 hidden rounded-2xl bg-primary px-5 py-4 text-white shadow-[var(--shadow-elevated)] sm:block">
            <p className="text-xs uppercase tracking-wide text-white/80">
              Together
            </p>
            <p className="text-lg font-bold leading-tight">We Save Lives</p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            About Lifeline
          </p>
          <h2 className="text-3xl font-bold leading-tight text-navy sm:text-4xl">
            People helping people for a{" "}
            <span className="text-primary">brighter tomorrow.</span>
          </h2>
          <p className="mt-4 text-sm text-text-secondary sm:text-base">
            Lifeline started with a simple belief — no one should suffer due to
            the unavailability of blood. What began as a student initiative has
            grown into a community of thousands of donors, volunteers, and
            partner organizations across Nagpur and beyond.
          </p>

          <div className="mt-8 space-y-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${v.accent}`}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-navy">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {v.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}