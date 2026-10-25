import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const newsItems = [
  {
    id: 1,
    slug: 'delta-force-season-3-update',
    title: 'Delta Force Season 3 Update - New Maps and Weapons',
    excerpt: 'The latest season brings exciting new content including 3 new maps, 5 new weapons, and an overhauled ranking system.',
    date: '2026-03-05',
    category: 'Game Update',
    image: '/images/control-room.jpg',
  },
  {
    id: 2,
    slug: 'flash-sale-weekend',
    title: 'Flash Sale Weekend - Up to 50% Off All Accounts',
    excerpt: 'This weekend only! Get premium Delta Force accounts at half price. Limited stock available.',
    date: '2026-03-04',
    category: 'Promotion',
    image: '/images/scoreboard-desk.jpg',
  },
  {
    id: 3,
    slug: 'new-boosting-service',
    title: 'New Boosting Service: Ranked to Diamond',
    excerpt: 'Our professional boosters can now help you reach Diamond rank with guaranteed results and account safety.',
    date: '2026-03-03',
    category: 'Service',
    image: '/images/community-event.jpg',
  },
  {
    id: 4,
    slug: 'community-tournament',
    title: 'Community Tournament - Win $500 Prize Pool',
    excerpt: 'Join our monthly community tournament. Register now for a chance to win cash prizes and exclusive items.',
    date: '2026-03-01',
    category: 'Event',
    image: '/images/production-crew.jpg',
  },
  {
    id: 5,
    slug: 'security-update',
    title: 'Security Update: Enhanced Account Protection',
    excerpt: 'We have implemented new security measures to better protect your purchases and account information.',
    date: '2026-02-28',
    category: 'Announcement',
    image: '/images/control-room-wide.jpg',
  },
];

export default function NewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">News & Updates</h1>

      <div className="space-y-4">
        {newsItems.map((item) => (
          <Link
            key={item.id}
            href={`/booster/news/${item.slug}`}
            className="block bg-card rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-primary/30 transition-colors group"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-40 sm:h-28 w-full h-40 shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover sm:rounded-l-xl"
                />
              </div>

              <div className="p-4 flex flex-col justify-center flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded font-medium">
                    {item.category}
                  </span>
                  <span className="text-muted text-xs flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                <p className="text-muted text-sm leading-relaxed mb-2 line-clamp-2">{item.excerpt}</p>
                <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
