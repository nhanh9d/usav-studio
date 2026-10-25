import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const newsItems = [
  {
    id: 1,
    slug: 'delta-force-season-3-update',
    title: 'Delta Force Season 3 Update - New Maps and Weapons',
    excerpt: 'The latest season brings exciting new content including 3 new maps, 5 new weapons, and an overhauled ranking system.',
    content: `Delta Force Season 3 is here and it's packed with exciting new content that will change the way you play.

**New Maps**
Three brand new maps have been added to the rotation: Arctic Fortress, Desert Storm, and Neon City. Each map features unique terrain and strategic elements that will test your skills in different ways.

**New Weapons**
Five new weapons join the arsenal this season:
- AKS-74U: A compact assault rifle perfect for close-quarters combat
- P90: High fire rate SMG with excellent accuracy
- AWM: Bolt-action sniper rifle with devastating damage
- SPAS-12: Semi-automatic shotgun for aggressive playstyles
- Desert Eagle: A powerful sidearm for clutch moments

**Overhauled Ranking System**
The ranking system has been completely reworked. New tiers have been added between Diamond and Legendary, and the matchmaking algorithm now considers individual performance more heavily.

**Quality of Life Improvements**
- Improved server stability and reduced latency
- New UI for the loadout screen
- Bug fixes for several map exploits
- Enhanced anti-cheat measures

Make sure to log in and check out all the new content!`,
    date: '2026-03-05',
    category: 'Game Update',
    image: '/images/control-room.jpg',
  },
  {
    id: 2,
    slug: 'flash-sale-weekend',
    title: 'Flash Sale Weekend - Up to 50% Off All Accounts',
    excerpt: 'This weekend only! Get premium Delta Force accounts at half price. Limited stock available.',
    content: `Our biggest sale of the year is here! This weekend, enjoy massive discounts on all Delta Force accounts.

**What's On Sale?**
- Garena VN accounts: 30-50% off
- Premium OP accounts: 40% off
- Budget accounts: 25% off
- Consignment accounts: Special pricing

**Sale Duration**
The flash sale runs from Friday 00:00 to Sunday 23:59 (GMT+7). All discounts are applied automatically at checkout.

**Limited Stock**
Premium accounts are in limited supply. Once they're gone, they're gone! Don't miss out on this opportunity to grab a high-value account at an unbeatable price.

**How to Participate**
Simply browse our products page and add items to your cart. Discounted prices are shown automatically. No coupon code needed!

Visit our products page now to see all available deals.`,
    date: '2026-03-04',
    category: 'Promotion',
    image: '/images/scoreboard-desk.jpg',
  },
  {
    id: 3,
    slug: 'new-boosting-service',
    title: 'New Boosting Service: Ranked to Diamond',
    excerpt: 'Our professional boosters can now help you reach Diamond rank with guaranteed results and account safety.',
    content: `We're excited to announce our new premium boosting service that guarantees Diamond rank achievement.

**How It Works**
1. Choose your current rank and desired target rank
2. Select your preferred boosting speed
3. Our verified professional players handle the rest
4. Receive notifications as milestones are reached

**Account Safety**
Your account security is our top priority. All boosters:
- Use VPN protection matching your region
- Play at natural times and pacing
- Never use any third-party software
- Follow strict account handling protocols

**Pricing**
- Bronze to Gold: Starting at $19.99
- Gold to Platinum: Starting at $34.99
- Platinum to Diamond: Starting at $49.99
- Custom rank packages available

**Satisfaction Guarantee**
If we fail to reach your target rank within the agreed timeframe, you'll receive a full refund. No questions asked.

Contact our team to get started with your rank boost today!`,
    date: '2026-03-03',
    category: 'Service',
    image: '/images/community-event.jpg',
  },
  {
    id: 4,
    slug: 'community-tournament',
    title: 'Community Tournament - Win $500 Prize Pool',
    excerpt: 'Join our monthly community tournament. Register now for a chance to win cash prizes and exclusive items.',
    content: `Our March Community Tournament is open for registration! Compete against fellow players for a share of the $500 prize pool.

**Tournament Details**
- Format: 5v5 Elimination
- Date: March 15-16, 2026
- Registration Deadline: March 13, 2026
- Prize Pool: $500

**Prize Distribution**
- 1st Place: $250 + Exclusive "Champion" badge
- 2nd Place: $150 + Rare account skin
- 3rd Place: $100 + Store credit
- All participants: 50 bonus reward points

**How to Register**
1. Have an active USAV account
2. Form a team of 5 players
3. Submit your team via the registration form
4. Receive confirmation and match schedule

**Rules**
- All players must use their own accounts
- No third-party software allowed
- Matches are best-of-3 until semifinals (best-of-5)
- Tournament admins' decisions are final

Good luck to all participants!`,
    date: '2026-03-01',
    category: 'Event',
    image: '/images/production-crew.jpg',
  },
  {
    id: 5,
    slug: 'security-update',
    title: 'Security Update: Enhanced Account Protection',
    excerpt: 'We have implemented new security measures to better protect your purchases and account information.',
    content: `We take your security seriously. Today we're rolling out significant security improvements across the platform.

**What's New**
- **Two-Factor Authentication**: Optional 2FA is now available for all accounts
- **Login Notifications**: Receive alerts for new device logins
- **Session Management**: View and revoke active sessions from settings
- **Enhanced Encryption**: Upgraded to AES-256 encryption for all sensitive data

**Recommended Actions**
We recommend all users:
1. Enable two-factor authentication in your account settings
2. Review your active sessions and revoke any unfamiliar ones
3. Update your password if you haven't changed it recently
4. Verify your recovery email is current

**Purchase Protection**
All purchases now include enhanced protection:
- Automatic fraud detection on transactions
- 24-hour purchase verification window
- Improved dispute resolution process
- Encrypted delivery of account credentials

**Reporting Issues**
If you notice any suspicious activity on your account, please contact our support team immediately at toanvu@usavstudio.com.

Thank you for being part of our community. Your trust and security are our top priorities.`,
    date: '2026-02-28',
    category: 'Announcement',
    image: '/images/control-room-wide.jpg',
  },
];

export function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.slug }));
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = newsItems.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/booster/news"
        className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm mb-6"
      >
        <ArrowLeft size={16} />
        Back to News
      </Link>

      <article>
        <div className="rounded-xl overflow-hidden mb-6 h-64 sm:h-80">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="bg-primary/20 text-primary text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1">
            <Tag size={12} />
            {article.category}
          </span>
          <span className="text-muted text-xs flex items-center gap-1">
            <Calendar size={12} />
            {new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6">{article.title}</h1>

        <div className="bg-card rounded-xl p-6 sm:p-8 border border-[#2a2a2a]">
          <div className="prose prose-invert max-w-none">
            {article.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-white mt-6 mb-3">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={idx} className="space-y-1.5 my-3">
                    {paragraph.split('\n').map((line, lineIdx) => (
                      <li key={lineIdx} className="text-muted text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-primary mt-1.5 text-[6px]">●</span>
                        {line.replace(/^- /, '').replace(/\*\*/g, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\./.test(paragraph)) {
                return (
                  <ol key={idx} className="space-y-1.5 my-3">
                    {paragraph.split('\n').map((line, lineIdx) => (
                      <li key={lineIdx} className="text-muted text-sm leading-relaxed">
                        {line.replace(/\*\*/g, '')}
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-muted text-sm leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
