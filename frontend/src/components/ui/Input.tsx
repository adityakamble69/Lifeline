import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-[10px] border bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-secondary " +
  "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 " +
  "disabled:cursor-not-allowed disabled:bg-background disabled:opacity-60";

function borderClasses(invalid?: boolean) {
  return invalid
    ? "border-error focus:border-error"
    : "border-border focus:border-primary";
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      suppressHydrationWarning
      className={cn(fieldBase, "h-11", borderClasses(invalid), className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      suppressHydrationWarning
      className={cn(fieldBase, "py-2.5 resize-y", borderClasses(invalid), className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      suppressHydrationWarning
      className={cn(
        fieldBase,
        "h-11 appearance-none bg-[right_0.9rem_center] bg-no-repeat",
        borderClasses(invalid),
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  help?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  help,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-navy">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-error">{error}</p>
      ) : help ? (
        <p className="text-xs text-text-secondary">{help}</p>
      ) : null}
    </div>
  );
}