'use client';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Locale } from '@/content/site';
import { boosterDictionaries, LANG_COOKIE, type BoosterDict } from '@/lib/boosterI18n';

interface LocaleValue {
  locale: Locale;
  t: BoosterDict;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleValue | null>(null);

// `initialLocale` comes from the language cookie, read on the server in src/app/booster/layout.tsx.
export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    setLocaleState(next);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t: boosterDictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale must be used inside LocaleProvider');
  return value;
}
