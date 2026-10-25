import { Star } from 'lucide-react';

const influencers = [
  {
    name: 'Kim Chi',
    role: 'TikToker',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/Kim%20Chi.png',
  },
  {
    name: 'VuTkan',
    role: 'YouTuber',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/vutkan.webp',
  },
  {
    name: 'KenP',
    role: 'YouTuber',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/kenp.webp',
  },
  {
    name: 'LongKaka',
    role: 'Streamer',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/LONGKAKADFVN.webp',
  },
  {
    name: 'TiuCng',
    role: 'Streamer',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/TiuCngStream.webp',
  },
  {
    name: 'TuT',
    role: 'Streamer',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/TuTDeltaforce.webp',
  },
  {
    name: 'Lq Tri',
    role: 'TikToker',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/tri.webp',
  },
  {
    name: 'Isch97',
    role: 'YouTuber',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/isch97.webp',
  },
];

export default function InfluencerSection() {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star size={20} className="text-primary" />
        <h2 className="text-xl font-bold text-white">IDOL PR Guarantee</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {influencers.map((inf) => (
          <div
            key={inf.name}
            className="bg-card rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-primary transition-colors group cursor-pointer"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={inf.image}
                alt={inf.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="text-white font-semibold text-xs truncate">
                {inf.name}
              </h3>
              <p className="text-muted text-[10px]">{inf.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
