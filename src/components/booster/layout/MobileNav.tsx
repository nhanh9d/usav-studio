'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, Coins, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/booster', icon: Home, label: 'Home' },
  { href: '/booster/products', icon: Grid3X3, label: 'Menu' },
  { href: '/booster/products?category=topup', icon: Coins, label: 'Top-Up' },
  { href: '/booster/products?category=accounts', icon: ShoppingBag, label: 'Buy Acc' },
  { href: '/booster/account', icon: User, label: 'Account' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-header border-t border-[#222] safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-1 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted'
              )}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
