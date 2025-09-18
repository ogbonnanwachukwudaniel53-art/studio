import { Logo } from '@/components/logo';

export default function SplashScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-primary fixed inset-0 z-[200]">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <Logo className="h-20 w-20" />
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter font-headline">EduResult Pro</h1>
            <p className="mt-2 text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    </div>
  );
}
