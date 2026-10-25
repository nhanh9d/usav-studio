'use client';
import { locales } from '@/content/site';
import { cn } from '@/lib/utils';
import { useLocale } from './LocaleProvider';

export default function LanguageSwitch({ className }: { className?: string }) {
  const { locale, t, setLocale } = useLocale();

  return (
    <div role="group" aria-label={t.common.language} className={cn('flex rounded-lg border border-[#333] p-0.5 text-xs', className)}>
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            'px-2 py-1 rounded-md font-semibold uppercase transition-colors',
            locale === l ? 'bg-primary/20 text-primary' : 'text-muted hover:text-white'
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
