import Link from 'next/link';
import { Gamepad2, Gift, RotateCw } from 'lucide-react';

const games = [
  { name: 'Vong Quay May Man', icon: RotateCw, tint: 'from-primary/40' },
  { name: 'Bao Li Xi', icon: Gift, tint: 'from-accent/40' },
];

export default function MinigamePreview() {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Gamepad2 size={20} className="text-accent" />
        <h2 className="text-xl font-bold text-white">Minigames</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {games.map(({ name, icon: Icon, tint }) => (
          <Link href="/booster/minigame" key={name}>
            <div
              className={`relative h-40 sm:h-48 rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-accent/50 transition-all group bg-gradient-to-br ${tint} to-card`}
            >
              <Icon
                size={120}
                strokeWidth={1.25}
                className="absolute -right-4 -bottom-4 text-white/10 group-hover:text-white/20 transition-colors"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg group-hover:text-accent transition-colors">{name}</h3>
                <p className="mt-1 text-xs text-gray-300">Play now</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
