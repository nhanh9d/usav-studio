'use client';
import { cn } from '@/lib/utils';
import { Gamepad2, Coins, Sword, Gem, Zap, GraduationCap, Wrench, LayoutGrid } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Products', icon: LayoutGrid },
  { id: 'accounts', label: 'Game Accounts', icon: Gamepad2 },
  { id: 'topup', label: 'Top-Up', icon: Coins },
  { id: 'items', label: 'In-Game Items', icon: Sword },
  { id: 'currency', label: 'Game Currency', icon: Gem },
  { id: 'boost', label: 'Boosting', icon: Zap },
  { id: 'coaching', label: 'Coaching', icon: GraduationCap },
  { id: 'services', label: 'Other Services', icon: Wrench },
];

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="w-full md:w-60 shrink-0">
      <div className="bg-card rounded-xl p-4 border border-[#2a2a2a]">
        <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
          <LayoutGrid size={16} className="text-primary" />
          Categories
        </h3>
        <ul className="space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => onCategoryChange(cat.id)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3',
                    activeCategory === cat.id
                      ? 'bg-primary/20 text-primary font-medium border border-primary/30'
                      : 'text-muted hover:text-white hover:bg-[#2a2a2a]'
                  )}
                >
                  <Icon size={16} className={activeCategory === cat.id ? 'text-primary' : 'text-muted'} />
                  {cat.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
