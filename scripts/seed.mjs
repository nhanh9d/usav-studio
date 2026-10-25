import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/usav';

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    originalPrice: Number,
    discount: Number,
    stock: Number,
    sold: Number,
    images: [String],
    category: String,
    server: String,
    status: { type: String, default: 'active' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const products = [
  {
    title: 'Delta Force Premium Account - Level 50',
    slug: 'delta-force-premium-level-50',
    description: 'Premium Delta Force account with Level 50, multiple rare skins, and unlocked weapons. Account comes with full email access and secure transfer.',
    price: 29.99,
    originalPrice: 49.99,
    discount: 40,
    stock: 15,
    sold: 142,
    images: [],
    category: 'accounts',
    server: 'NA',
    featured: true,
  },
  {
    title: 'Delta Force Starter Account - Fresh',
    slug: 'delta-force-starter-fresh',
    description: 'Brand new Delta Force account ready to play. Clean history, no bans.',
    price: 4.99,
    originalPrice: 9.99,
    discount: 50,
    stock: 50,
    sold: 320,
    images: [],
    category: 'accounts',
    server: 'NA',
    featured: true,
  },
  {
    title: 'Delta Force EU Account - Diamond Rank',
    slug: 'delta-force-eu-diamond-rank',
    description: 'Diamond rank account on EU servers. Full weapon collection. Premium battle pass completed.',
    price: 59.99,
    originalPrice: 89.99,
    discount: 33,
    stock: 5,
    sold: 48,
    images: [],
    category: 'accounts',
    server: 'EU',
    featured: true,
  },
  {
    title: '1000 Delta Coins Top-Up',
    slug: '1000-delta-coins-topup',
    description: 'Instant delivery of 1000 Delta Coins to your account. Provide your player ID after purchase.',
    price: 9.99,
    originalPrice: 9.99,
    discount: 0,
    stock: 999,
    sold: 1580,
    images: [],
    category: 'topup',
    server: '',
    featured: true,
  },
  {
    title: '5000 Delta Coins Top-Up',
    slug: '5000-delta-coins-topup',
    description: 'Instant delivery of 5000 Delta Coins. Best value pack!',
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    stock: 999,
    sold: 890,
    images: [],
    category: 'topup',
    server: '',
    featured: true,
  },
  {
    title: 'Legendary Weapon Skin Bundle',
    slug: 'legendary-weapon-skin-bundle',
    description: 'Collection of 5 legendary weapon skins. Includes exclusive limited-edition designs.',
    price: 19.99,
    originalPrice: 34.99,
    discount: 43,
    stock: 25,
    sold: 210,
    images: [],
    category: 'items',
    server: '',
    featured: true,
  },
  {
    title: 'Rank Boost - Gold to Diamond',
    slug: 'rank-boost-gold-to-diamond',
    description: 'Professional boosting service. Our team will boost your account from Gold to Diamond rank. ETA: 3-5 days.',
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    stock: 10,
    sold: 75,
    images: [],
    category: 'boost',
    server: 'NA',
    featured: false,
  },
  {
    title: 'Rank Boost - Silver to Gold',
    slug: 'rank-boost-silver-to-gold',
    description: 'Get boosted from Silver to Gold rank by our professional players. Safe and fast.',
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    stock: 20,
    sold: 156,
    images: [],
    category: 'boost',
    server: 'NA',
    featured: false,
  },
  {
    title: '1-Hour Pro Coaching Session',
    slug: '1-hour-pro-coaching',
    description: 'One-on-one coaching with a professional Delta Force player. Improve your skills and game sense.',
    price: 14.99,
    originalPrice: 19.99,
    discount: 25,
    stock: 30,
    sold: 92,
    images: [],
    category: 'coaching',
    server: '',
    featured: true,
  },
  {
    title: 'Battle Pass - Current Season',
    slug: 'battle-pass-current-season',
    description: 'Unlock the current season Battle Pass with all premium rewards.',
    price: 12.99,
    originalPrice: 14.99,
    discount: 13,
    stock: 500,
    sold: 2340,
    images: [],
    category: 'items',
    server: '',
    featured: false,
  },
  {
    title: 'Asia Server Premium Account',
    slug: 'asia-server-premium-account',
    description: 'High-level account on Asia servers with rare collectibles and skins.',
    price: 34.99,
    originalPrice: 54.99,
    discount: 36,
    stock: 8,
    sold: 63,
    images: [],
    category: 'accounts',
    server: 'Asia',
    featured: false,
  },
  {
    title: '500 Delta Coins Top-Up',
    slug: '500-delta-coins-topup',
    description: 'Quick 500 Delta Coins delivery. Perfect for small purchases.',
    price: 4.99,
    originalPrice: 4.99,
    discount: 0,
    stock: 999,
    sold: 3200,
    images: [],
    category: 'topup',
    server: '',
    featured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    console.log('Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
