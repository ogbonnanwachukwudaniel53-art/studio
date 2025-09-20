
"use client";

import { Logo } from '@/components/logo';
import { useSchool } from '@/lib/school-context';

export default function SplashScreen() {
  const { schoolName } = useSchool();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-primary fixed inset-0 z-[200]">
      <div className="flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDuration: '1s' }}>
        <Logo className="h-20 w-20" />
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter font-headline">{schoolName}</h1>
            <p className="mt-2 text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    </div>
  );
}
