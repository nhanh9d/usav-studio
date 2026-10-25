'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BoosterDict } from '@/lib/boosterI18n';
import LanguageSwitch from '@/components/booster/LanguageSwitch';
import { useLocale } from '@/components/booster/LocaleProvider';

// Only the screens open for now (see OPEN_PATHS in src/proxy.ts); the store navigation is hidden.
const LINKS: { href: string; label: keyof BoosterDict['nav']; roles: string[] }[] = [
  { href: '/booster/shifts', label: 'myShifts', roles: ['booster', 'admin'] },
  { href: '/booster/book', label: 'book', roles: ['buyer', 'admin'] },
  { href: '/booster/admin/orders', label: 'admin', roles: ['admin'] },
];

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t } = useLocale();
  const role = (session?.user as { role?: string } | undefined)?.role || '';
  const links = LINKS.filter((link) => link.roles.includes(role));

  return (
    <header className="sticky top-0 z-40 bg-header border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link href="/booster" className="shrink-0">
          <img src="/images/logo-white.png" alt="USAV Studio" className="h-8" />
        </Link>

        {/* One link has nothing to switch between, so the nav only shows for admins. */}
        {links.length > 1 && (
          <nav className="flex items-center gap-5 text-sm overflow-x-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'whitespace-nowrap transition-colors',
                  pathname.startsWith(link.href) ? 'text-primary font-semibold' : 'text-white hover:text-primary'
                )}
              >
                {t.nav[link.label]}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <LanguageSwitch />
          {session?.user && (
            <>
              <span className="flex items-center gap-2 text-sm text-white">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </span>
                <span className="hidden sm:inline">{session.user.name}</span>
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/booster' })}
                className="text-muted hover:text-white transition-colors"
                aria-label={t.common.signOut}
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
