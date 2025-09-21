
"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSchool } from "@/lib/school-context";
import { SchoolProvider } from "@/lib/school-context";


function AuthLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { schoolName } = useSchool();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <main className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-3 text-foreground">
            <Logo className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold font-headline">{schoolName}</span>
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <SchoolProvider>
            <AuthLayoutContent>{children}</AuthLayoutContent>
        </SchoolProvider>
    )
}
