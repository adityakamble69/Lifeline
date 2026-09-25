import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

// TODO(Phase 5): replace with real data from GET /api/v1/camps?status=published&limit=3
const camps = [
  {
    title: "City Youth Blood Camp",
    date: "28 Sep 2026",
    venue: "Raman Science Centre, Nagpur",
    time: "9:00 AM – 4:00 PM",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Red Heart Foundation Camp",
    date: "05 Oct 2026",
    venue: "VNIT Campus, Nagpur",
    time: "10:00 AM – 5:00 PM",
    image:
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Community Blood Drive",
    date: "12 Oct 2026",
    venue: "IT Park, Nagpur",
    time: "9:00 AM – 3:00 PM",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
  },
];

export function UpcomingCampsPreview() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Blood donation camps
            </p>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">
              Upcoming <span className="text-primary">Camps</span>
            </h2>
            <p className="mt-2 text-sm text-text-secondary sm:text-base">
              Be a part of the next life-saving event in your city.
            </p>
          </div>
          <Link
            href="/camps"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View all camps
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {camps.map((c) => (
            <article
              key={c.title}
              className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="relative aspect-[16/9] bg-background">
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-xl bg-primary px-3 py-1.5 text-center text-white shadow-md">
                  <span className="block text-lg font-bold leading-none">
                    {c.date.split(" ")[0]}
                  </span>
                  <span className="block text-[10px] font-medium uppercase tracking-wide">
                    {c.date.split(" ")[1]}
                  </span>
                </span>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-base font-semibold text-navy">{c.title}</h3>
                <div className="mt-3 space-y-1.5 text-sm text-text-secondary">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {c.venue}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {c.time}
                  </p>
                </div>
                <div className="mt-5">
                  <Link href="/camps">
                    <Button variant="primary" size="sm" className="w-full gap-2">
                      Register
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}