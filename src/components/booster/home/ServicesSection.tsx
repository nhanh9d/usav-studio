import Link from 'next/link';
import { Coins, Gamepad2, GraduationCap, Zap } from 'lucide-react';

const services = [
  { title: 'Rank Boosting', description: 'Reach your target rank with a USAV booster', icon: Zap, category: 'boost' },
  { title: 'Coaching', description: 'Play alongside and learn from experienced players', icon: GraduationCap, category: 'coaching' },
  { title: 'Top-Up', description: 'Delta Coin and in-game currency', icon: Coins, category: 'topup' },
  { title: 'Game Accounts', description: 'Ready-to-play Delta Force accounts', icon: Gamepad2, category: 'accounts' },
];

export default function ServicesSection() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Our Services</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {services.map(({ title, description, icon: Icon, category }) => (
          <Link
            key={title}
            href={`/booster/products?category=${category}`}
            className="bg-card rounded-xl p-4 border border-[#2a2a2a] hover:border-primary/50 transition-colors group"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/15 text-primary flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <Icon size={22} />
            </div>
            <h3 className="mt-3 text-white font-semibold text-sm">{title}</h3>
            <p className="text-muted text-xs mt-1">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
