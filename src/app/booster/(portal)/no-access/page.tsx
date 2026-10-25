'use client';
import { ShieldQuestion } from 'lucide-react';
import { contact } from '@/content/site';
import { useLocale } from '@/components/booster/LocaleProvider';

// Shown at /booster to signed-in users whose Discord roles give them no buyer or booster access (see src/proxy.ts).
export default function NoAccessPage() {
  const { t } = useLocale();
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-14 h-14 mx-auto rounded-xl bg-primary/15 text-primary flex items-center justify-center">
        <ShieldQuestion size={28} />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-white">{t.noAccess.title}</h1>
      <p className="mt-3 text-muted text-sm leading-relaxed">
        {t.noAccess.body}
      </p>
      <p className="mt-6 text-sm text-muted">
        {t.noAccess.questions}{' '}
        <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
          {contact.email}
        </a>
        .
      </p>
    </div>
  );
}
