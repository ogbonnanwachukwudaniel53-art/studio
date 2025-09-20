
"use client";

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/splash-screen';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if we've already shown the splash screen in this session
    if (sessionStorage.getItem('splashScreenShown')) {
      setIsFirstLoad(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsFirstLoad(false);
      sessionStorage.setItem('splashScreenShown', 'true');
    }, 1500); // Splash screen for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isFirstLoad) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
