import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-deep via-primary to-primary-deep px-8 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
          {/* Decorative heart */}
          <Heart
            className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 text-white/5 sm:h-52 sm:w-52"
            fill="currentColor"
            aria-hidden
          />
          <Heart
            className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 text-white/5 sm:h-56 sm:w-56"
            fill="currentColor"
            aria-hidden
          />

          <div className="relative mx-auto max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
              Be a part of the change
            </p>
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Together, we can save more lives.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/90 sm:text-base">
              Join our growing community of donors, volunteers, and supporters
              working to make blood available to everyone who needs it.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/become-a-donor">
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2 border-transparent bg-surface text-primary hover:bg-primary-light"
                >
                  Become a Donor
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}