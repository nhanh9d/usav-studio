'use client';
import Link from 'next/link';
import Carousel from '@/components/booster/ui/Carousel';

// USAV's own photos with the copy on top; no third-party banner artwork.
const banners = [
  {
    id: 1,
    src: '/images/control-room.jpg',
    eyebrow: 'USAV Account Booster',
    title: 'Boosting & coaching for Delta Force',
    body: 'From the team that runs and broadcasts USAV Studio tournaments.',
    href: '/booster/products?category=boost',
    cta: 'See services',
  },
  {
    id: 2,
    src: '/images/dfdheat-winner.jpg',
    eyebrow: 'Delta Force Dream HEAT',
    title: 'Champions: Bách Quỷ Dạ Hành',
    body: 'Results, standings and the FMVP of our latest tournament.',
    href: '/en/tournaments/heat',
    cta: 'See results',
  },
  {
    id: 3,
    src: '/images/production-crew.jpg',
    eyebrow: 'USAV Studio',
    title: 'Tournaments, content & community',
    body: 'Organizing, producing and casting Delta Force events in Vietnam.',
    href: '/vi',
    cta: 'About the studio',
  },
];

export default function HeroBanner() {
  return (
    <section className="mb-8">
      <Carousel>
        {banners.map((banner) => (
          <div key={banner.id} className="relative h-56 sm:h-72 md:h-[400px] w-full">
            <img
              src={banner.src}
              alt=""
              className="w-full h-full object-cover"
              loading={banner.id === 1 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 max-w-xl">
              <p className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-widest">{banner.eyebrow}</p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white leading-tight">{banner.title}</h2>
              <p className="mt-2 text-sm sm:text-base text-gray-300">{banner.body}</p>
              <Link
                href={banner.href}
                className="mt-4 self-start bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
              >
                {banner.cta}
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
