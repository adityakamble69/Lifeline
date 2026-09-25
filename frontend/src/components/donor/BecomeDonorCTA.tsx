"use client";

import Link from "next/link";
import { SignUpButton, Show } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface BecomeDonorCTAProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "light";
  className?: string;
  label?: string;
}

export function BecomeDonorCTA({
  size = "md",
  variant = "primary",
  className,
  label = "Register as a Donor",
}: BecomeDonorCTAProps) {
  const lightClasses =
    variant === "light"
      ? "border-transparent bg-surface text-primary hover:bg-primary-light"
      : "";

  return (
    <>
      {/* Signed out → Clerk sign-up modal */}
      <Show when="signed-out">
        <SignUpButton mode="modal">
          <Button
            variant={variant === "light" ? "secondary" : "primary"}
            size={size}
            className={cn("gap-2", lightClasses, className)}
          >
            {label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </SignUpButton>
      </Show>

      {/* Signed in → donor dashboard (profile completion happens there) */}
      <Show when="signed-in">
        <Link href="/dashboard/profile">
          <Button
            variant={variant === "light" ? "secondary" : "primary"}
            size={size}
            className={cn("gap-2", lightClasses, className)}
          >
            Complete Your Profile
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Link>
      </Show>
    </>
  );
}