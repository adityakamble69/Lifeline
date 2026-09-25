import Link from "next/link";
import { Droplet } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Link href="/" className="flex items-center gap-2 font-bold text-navy">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
          <Droplet className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-xl">Lifeline</span>
      </Link>
      {children}
    </div>
  );
}
