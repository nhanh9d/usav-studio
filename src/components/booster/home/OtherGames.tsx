import Link from 'next/link';

const games = [
  {
    name: 'Free Fire',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/Thumb%20all%20web/Nick/Acc%20Free%20Fire%20T%E1%BB%B1%20Ch%E1%BB%8Dn.jpg',
    href: '#',
  },
  {
    name: 'PUBG Mobile',
    image: 'https://cdn3.upanh.info/upload/server-sw3/acc-category-deltashopritocom/224466/images/ThuenickPUBGMobilehot-ezgif_com-png-to-webp-converter.webp',
    href: '#',
  },
  {
    name: 'League of Legends',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/nick%20lien%20minh%202.png',
    href: '#',
  },
  {
    name: 'Valorant',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/Thumb%20all%20web/Nick/Acc%20Valorant%20Drop%20Mail.jpg',
    href: '#',
  },
  {
    name: 'CrossFire',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/Thumb%20all%20web/Nick/Acc%20D%E1%BB%99t%20Kich%20VIP.png',
    href: '#',
  },
  {
    name: 'Mobile Legends',
    image: 'https://cdn3.upanh.info/upload/server-sw3/images/Thumb%20all%20web/Nick/Ban%20Nick%20T%E1%BB%91c%20Chi%E1%BA%BFn.png',
    href: '#',
  },
];

export default function OtherGames() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Other Games</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {games.map((game) => (
          <Link
            key={game.name}
            href={game.href}
            className="group block rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-primary/50 transition-all duration-300 bg-card"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-2 text-center">
              <span className="text-white text-sm font-medium group-hover:text-primary transition-colors">
                {game.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
