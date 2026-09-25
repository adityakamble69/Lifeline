import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Required when variant="icon" and there is no visible text label. */
  "aria-label"?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-deep active:bg-primary-deep disabled:bg-primary/50",
  secondary:
    "bg-surface text-text-primary border border-border hover:bg-background disabled:opacity-50",
  destructive:
    "bg-error text-white hover:bg-deep-red active:bg-deep-red disabled:bg-error/50",
  ghost: "bg-transparent text-navy hover:bg-background disabled:opacity-50",
  icon: "bg-transparent text-text-secondary hover:bg-background hover:text-text-primary disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-11 w-11 p-0 justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        suppressHydrationWarning
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-[10px] font-semibold",
          "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";