import { Logo } from "@/components/logo";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <main className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-3 text-foreground">
            <Logo className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold font-headline">EduResult Pro</span>
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
