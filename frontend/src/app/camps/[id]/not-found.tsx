import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/layout";
import { Button } from "@/components/ui/Button";

export default function CampNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="flex max-w-md flex-col items-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
            <AlertCircle className="h-8 w-8" aria-hidden />
          </span>
          <h1 className="text-2xl font-bold text-navy">Camp not found</h1>
          <p className="text-sm text-text-secondary">
            The camp you&apos;re looking for doesn&apos;t exist or may have been
            removed.
          </p>
          <Link href="/camps" className="mt-3">
            <Button variant="primary" size="md" className="gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to all camps
            </Button>
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}