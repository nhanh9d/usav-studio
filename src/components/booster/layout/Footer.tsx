'use client';
import Link from 'next/link';
import { contact } from '@/content/site';
import { useLocale } from '@/components/booster/LocaleProvider';

export default function Footer() {
  const { locale, t } = useLocale();
  return (
    <footer className="bg-header border-t border-[#222] mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-muted">
        <div className="flex items-center gap-4">
          <img src="/images/logo-white.png" alt="USAV Studio" className="h-7" />
          <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
            {contact.email}
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href={`/${locale}/terms-of-service`} className="hover:text-primary transition-colors">{t.footer.terms}</Link>
          <Link href={`/${locale}/privacy-policy`} className="hover:text-primary transition-colors">{t.footer.privacy}</Link>
          <span>&copy; {new Date().getFullYear()} USAV Studio</span>
        </div>
      </div>
    </footer>
  );
}
