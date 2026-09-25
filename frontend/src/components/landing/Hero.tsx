import Image from "next/image";
import Link from "next/link";
import { Droplet, Heart, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-6 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:p-12">
          {/* Left content */}
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              A small act. A big impact.
            </p>
            <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.08]">
              Give Blood.{" "}
              <span className="text-primary">Save Lives.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-text-secondary sm:text-lg">
              Your donation can give someone a second chance at life. Join our
              community and be the reason for a healthier tomorrow.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/become-a-donor">
                <Button variant="primary" size="lg" className="gap-2">
                  Donate Now
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/camps">
                <Button variant="secondary" size="lg">
                  Find a Blood Camp
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-primary-light text-xs font-bold text-primary"
                    aria-hidden
                  >
                    <Users className="h-4 w-4" />
                  </span>
                ))}
                <span className="flex h-9 min-w-9 items-center justify-center rounded-full border-2 border-surface bg-primary px-2 text-[10px] font-bold text-white">
                  +10K
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-navy">10,000+</span> people
                have already made a difference.
              </p>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="relative aspect-[16/11] max-h-[440px] overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)] lg:aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80"
                alt="Hands holding a red heart symbolising blood donation"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-surface/95 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                  <Droplet className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs text-text-secondary">
                    One donation can save up to
                  </p>
                  <p className="text-sm font-bold text-navy">3 Lives</p>
                </div>
              </div>
            </div>

            {/* Decorative heart */}
            <span
              className="pointer-events-none absolute -right-3 -top-3 hidden h-14 w-14 items-center justify-center rounded-full bg-surface text-primary shadow-[var(--shadow-card)] lg:flex"
              aria-hidden
            >
              <Heart className="h-6 w-6" fill="currentColor" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}