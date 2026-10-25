'use client';
import { useState, useRef } from 'react';
import { Trophy, RotateCcw, Gift, Clock, Star, Zap, Award } from 'lucide-react';
import Button from '@/components/booster/ui/Button';
import Image from 'next/image';

const prizes = [
  { label: '$5 Credit', color: '#01c684', textColor: '#fff' },
  { label: 'Try Again', color: '#2a2a2a', textColor: '#999' },
  { label: '$2 Credit', color: '#ff6d01', textColor: '#fff' },
  { label: '10% Off', color: '#F2CC67', textColor: '#111' },
  { label: '$10 Credit', color: '#01c684', textColor: '#fff' },
  { label: 'Try Again', color: '#2a2a2a', textColor: '#999' },
  { label: '$1 Credit', color: '#ff6d01', textColor: '#fff' },
  { label: '5% Off', color: '#F2CC67', textColor: '#111' },
];

const rewardTiers = [
  { tier: 'Common', chance: '40%', prizes: ['$1 Credit', '5% Off'], color: 'text-muted', bg: 'bg-[#2a2a2a]', icon: Gift },
  { tier: 'Uncommon', chance: '30%', prizes: ['$2 Credit', '10% Off'], color: 'text-blue-400', bg: 'bg-blue-500/15', icon: Star },
  { tier: 'Rare', chance: '20%', prizes: ['$5 Credit'], color: 'text-primary', bg: 'bg-primary/15', icon: Zap },
  { tier: 'Legendary', chance: '10%', prizes: ['$10 Credit', '$20 Credit'], color: 'text-gold', bg: 'bg-gold/15', icon: Award },
];

const prizeHistory = [
  { user: 'Gamer***23', prize: '$10 Credit', time: '2 min ago', tier: 'Legendary' },
  { user: 'Dark***99', prize: '$2 Credit', time: '5 min ago', tier: 'Uncommon' },
  { user: 'Ninja***07', prize: '5% Off', time: '8 min ago', tier: 'Common' },
  { user: 'Pro***51', prize: '$5 Credit', time: '12 min ago', tier: 'Rare' },
  { user: 'Wolf***44', prize: '$1 Credit', time: '15 min ago', tier: 'Common' },
  { user: 'Sky***88', prize: '10% Off', time: '18 min ago', tier: 'Uncommon' },
  { user: 'Fire***12', prize: '$10 Credit', time: '22 min ago', tier: 'Legendary' },
  { user: 'Ice***76', prize: '$2 Credit', time: '25 min ago', tier: 'Uncommon' },
];

export default function MinigamePage() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinsRemaining, setSpinsRemaining] = useState(3);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Red envelope states
  const [envelopeResult, setEnvelopeResult] = useState<{ show: boolean; prize: string; idx: number }>({
    show: false,
    prize: '',
    idx: -1,
  });
  const [clickedEnvelopes, setClickedEnvelopes] = useState<number[]>([]);

  const spin = () => {
    if (spinning || spinsRemaining <= 0) return;
    setSpinning(true);
    setResult(null);

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;
    const newRotation = rotation + 1440 + (360 - prizeIndex * segmentAngle - segmentAngle / 2);

    setRotation(newRotation);

    setTimeout(() => {
      setResult(prizes[prizeIndex].label);
      setSpinning(false);
      setSpinsRemaining((prev) => Math.max(0, prev - 1));
    }, 4000);
  };

  const openEnvelope = (idx: number) => {
    if (clickedEnvelopes.includes(idx)) return;
    const envelopePrizes = ['$1 Credit', '$2 Credit', '5% Off', '$5 Credit', '10% Off', 'Try Again'];
    const prize = envelopePrizes[Math.floor(Math.random() * envelopePrizes.length)];
    setClickedEnvelopes([...clickedEnvelopes, idx]);
    setEnvelopeResult({ show: true, prize, idx });
  };

  return (
    <div>
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-48">
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full relative">
            <Image
              src="https://cdn3.upanh.info/upload/server-sw3/images/Thumb%20GIF(6).webp"
              alt="Minigame Banner 1"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="w-1/2 h-full relative">
            <Image
              src="https://cdn3.upanh.info/upload/server-sw3/images/Thum%20GIF(1).webp"
              alt="Minigame Banner 2"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold text-white">Minigames</h1>
          <p className="text-muted text-sm mt-1">Spin the wheel, open envelopes, and win amazing prizes!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Spin Wheel */}
        <div className="bg-card rounded-xl p-8 border border-[#2a2a2a] text-center">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-gold" size={24} />
              Lucky Spin Wheel
            </h2>
            <div className="flex items-center gap-1.5 bg-primary/15 text-primary border border-primary/30 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Clock size={14} />
              {spinsRemaining}/5 spins left
            </div>
          </div>

          <div className="relative inline-block mb-6">
            {/* Outer glow ring */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-gold/20 blur-md" />

            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-gold drop-shadow-lg" />
            </div>

            {/* Wheel */}
            <div
              ref={wheelRef}
              className="w-72 h-72 rounded-full border-4 border-gold/40 relative overflow-hidden transition-transform duration-[4s] ease-[cubic-bezier(0.17,0.67,0.12,0.99)] shadow-xl shadow-primary/10"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Colored segments using conic-gradient */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${prizes
                    .map(
                      (p, i) =>
                        `${p.color} ${(i / prizes.length) * 100}% ${((i + 1) / prizes.length) * 100}%`
                    )
                    .join(', ')})`,
                }}
              />

              {/* Segment divider lines */}
              {prizes.map((_, i) => {
                const angle = (360 / prizes.length) * i;
                return (
                  <div
                    key={`line-${i}`}
                    className="absolute w-full h-full"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-black/20 origin-bottom" />
                  </div>
                );
              })}

              {/* Center labels */}
              {prizes.map((prize, i) => {
                const angle = (360 / prizes.length) * i + 360 / prizes.length / 2;
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 32 * Math.sin(rad);
                const y = 50 - 32 * Math.cos(rad);
                return (
                  <div
                    key={`label-${i}`}
                    className="absolute text-[10px] font-bold whitespace-nowrap drop-shadow-md"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      color: prize.textColor,
                    }}
                  >
                    {prize.label}
                  </div>
                );
              })}

              {/* Center circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-header to-[#1a1a1a] border-3 border-gold/50 flex items-center justify-center shadow-lg">
                  <span className="text-gold font-bold text-xs">SPIN</span>
                </div>
              </div>
            </div>
          </div>

          {result && (
            <div className="mb-4 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 border border-primary/30 rounded-xl p-4 animate-[fadeIn_0.3s_ease-out]">
              <p className="text-primary font-bold text-lg">You won: {result}</p>
              <p className="text-muted text-xs mt-1">Prize has been added to your account</p>
            </div>
          )}

          <Button
            onClick={spin}
            disabled={spinning || spinsRemaining <= 0}
            size="lg"
            className="gap-2 w-full max-w-xs"
          >
            <RotateCcw size={18} className={spinning ? 'animate-spin' : ''} />
            {spinning ? 'Spinning...' : spinsRemaining <= 0 ? 'No Spins Left' : 'Spin the Wheel'}
          </Button>
        </div>

        {/* Red Envelope */}
        <div className="bg-card rounded-xl p-8 border border-[#2a2a2a] text-center relative">
          <h2 className="text-xl font-bold text-white mb-2">Lucky Red Envelope</h2>
          <p className="text-muted text-sm mb-6">
            Open a red envelope for a chance to win credits, discounts, and exclusive items!
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <button
                key={i}
                onClick={() => openEnvelope(i)}
                disabled={clickedEnvelopes.includes(i)}
                className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all duration-300 ${
                  clickedEnvelopes.includes(i)
                    ? 'bg-[#2a2a2a] border-2 border-[#333] opacity-50 cursor-not-allowed scale-95'
                    : 'bg-red-600/20 border-2 border-red-600/40 hover:bg-red-600/30 hover:border-red-600/60 hover:scale-110 active:scale-90 cursor-pointer'
                }`}
              >
                <span className="text-3xl">{clickedEnvelopes.includes(i) ? '~' : '$'}</span>
              </button>
            ))}
          </div>

          <p className="text-muted text-xs">12,453 envelopes opened today</p>

          {/* Envelope Result Modal */}
          {envelopeResult.show && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setEnvelopeResult({ show: false, prize: '', idx: -1 })}>
              <div
                className="bg-card border border-[#2a2a2a] rounded-2xl p-8 max-w-sm w-full text-center animate-[bounceIn_0.4s_ease-out]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-600/40 flex items-center justify-center mx-auto mb-4">
                  <Gift size={36} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Envelope Opened!</h3>
                <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 border border-primary/30 rounded-xl p-4 mb-4">
                  <p className="text-primary font-bold text-2xl">{envelopeResult.prize}</p>
                </div>
                <p className="text-muted text-sm mb-5">Your reward has been added to your account.</p>
                <Button
                  onClick={() => setEnvelopeResult({ show: false, prize: '', idx: -1 })}
                  className="w-full"
                >
                  Awesome!
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reward Tiers */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Available Prizes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewardTiers.map((tier) => {
            const TierIcon = tier.icon;
            return (
              <div key={tier.tier} className="bg-card rounded-xl p-5 border border-[#2a2a2a]">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${tier.bg} flex items-center justify-center`}>
                    <TierIcon size={20} className={tier.color} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${tier.color}`}>{tier.tier}</p>
                    <p className="text-muted text-xs">{tier.chance} chance</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {tier.prizes.map((prize) => (
                    <div key={prize} className="bg-[#1a1a1a] rounded-lg px-3 py-1.5 text-xs text-white">
                      {prize}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prize History */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Recent Winners</h2>
        <div className="bg-card rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="divide-y divide-[#2a2a2a]">
            {prizeHistory.map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary">
                    {entry.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{entry.user}</p>
                    <p className="text-muted text-xs">{entry.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    entry.tier === 'Legendary' ? 'text-gold' :
                    entry.tier === 'Rare' ? 'text-primary' :
                    entry.tier === 'Uncommon' ? 'text-blue-400' :
                    'text-muted'
                  }`}>
                    {entry.prize}
                  </p>
                  <p className={`text-xs ${
                    entry.tier === 'Legendary' ? 'text-gold/60' :
                    entry.tier === 'Rare' ? 'text-primary/60' :
                    entry.tier === 'Uncommon' ? 'text-blue-400/60' :
                    'text-muted/60'
                  }`}>
                    {entry.tier}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
