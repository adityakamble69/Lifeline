import Link from "next/link";
import { AlertCircle, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmergencyBanner() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid items-center gap-8 rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-card)] sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary"
              aria-hidden
            >
              <AlertCircle className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                Need blood <span className="text-primary">urgently?</span>
              </h2>
              <p className="mt-2 max-w-xl text-sm text-text-secondary sm:text-base">
                Submit a blood request and get help from verified donors near
                you. Our team verifies every request to keep the network safe.
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-navy">
                <Phone className="h-4 w-4 text-primary" aria-hidden />
                24/7 Helpline: +91 98765 43210
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/emergency-request">
              <Button variant="primary" size="lg" className="w-full gap-2">
                Request Blood
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <Link href="/find-blood">
              <Button variant="secondary" size="lg" className="w-full">
                Find Blood
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}