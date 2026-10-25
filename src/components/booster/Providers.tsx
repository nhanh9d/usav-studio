'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import type { Locale } from '@/content/site';
import { LocaleProvider } from './LocaleProvider';

export default function Providers({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
    </SessionProvider>
  );
}
