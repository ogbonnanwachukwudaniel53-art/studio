
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import ClientLayout from './client-layout';
import { Toaster } from '@/components/ui/toaster';
import { PT_Sans, Inter } from 'next/font/google';
import { SchoolProvider } from '@/lib/school-context';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EduResult Pro',
  description: 'Manage and check student results with ease.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ptSans.variable} ${inter.variable} font-body antialiased`}
      >
        <ThemeProvider storageKey="eduresult-pro-theme">
          <SchoolProvider>
            <ClientLayout>{children}</ClientLayout>
          </SchoolProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
