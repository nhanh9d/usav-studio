'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, CalendarClock, CalendarPlus } from 'lucide-react';
import type { BoosterDict } from '@/lib/boosterI18n';
import LanguageSwitch from '@/components/booster/LanguageSwitch';
import { useLocale } from '@/components/booster/LocaleProvider';

// Dashboard, Products and Reports are hidden for now (see OPEN_PATHS in src/proxy.ts).
const navItems: { label: keyof BoosterDict['admin']; href: string; icon: typeof ShoppingCart }[] = [
  { label: 'orders', href: '/booster/admin/orders', icon: ShoppingCart },
  { label: 'shifts', href: '/booster/admin/shifts', icon: CalendarClock },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  const isActive = (href: string) => pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-primary/15 text-white'
                : 'text-muted hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Icon size={18} className={active ? 'text-primary' : ''} />
            {t.admin[item.label]}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#111] border border-[#2a2a2a] text-white"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-60 bg-[#111] border-r border-[#2a2a2a] flex flex-col transition-transform md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#2a2a2a]">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">U</span>
          </div>
          <span className="text-white font-bold text-lg">USAV Admin</span>
        </div>

        {/* Nav */}
        <div className="flex-1 py-4 overflow-y-auto">{nav}</div>

        {/* The buyer booking screen, for checking what buyers see */}
        <div className="px-3 py-4 border-t border-[#2a2a2a] space-y-3">
          <LanguageSwitch className="w-fit mx-3" />
          <Link
            href="/booster/book"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <CalendarPlus size={18} />
            {t.admin.bookingScreen}
          </Link>
        </div>
      </aside>
    </>
  );
}
