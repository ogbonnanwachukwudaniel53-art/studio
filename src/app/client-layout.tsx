"use client";

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/splash-screen';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Splash screen for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
