'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Check, Shield, Zap, Headphones, ChevronRight, Globe, Crosshair, User, Coins, Trophy, Hash, Smartphone } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/types';
import Button from '@/components/booster/ui/Button';
import ProductCard from '@/components/booster/products/ProductCard';

const PLACEHOLDER_IMAGE = '/images/booster-placeholder.svg';

const tierColors: Record<string, string> = {
  'Supreme S': 'bg-red-500/20 text-red-400 border border-red-500/30',
  'Supreme A': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  'Supreme B': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  'Supreme C': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  'Rare S': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  'Rare A': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'Rare B': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  'Rare C': 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
  'Common': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const rarityColors: Record<string, string> = {
  'Legendary': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  'Epic': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  'Rare': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'Common': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const serverColors: Record<string, string> = {
  NA: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
  EU: 'bg-purple-600/20 text-purple-400 border border-purple-500/30',
  Asia: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30',
  SEA: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.product || null;
        setProduct(found);
        setLoading(false);

        // Fetch related products from same category
        if (found) {
          fetch(`/api/products?category=${found.category}&limit=5`)
            .then((res) => res.json())
            .then((relData) => {
              const filtered = (relData.products || [])
                .filter((p: IProduct) => p._id !== found._id)
                .slice(0, 4);
              setRelatedProducts(filtered);
            });
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const addToCart = async () => {
    if (!session) {
      router.push('/booster/auth/signin');
      return;
    }
    if (!product) return;

    setAdding(true);
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // handle error
    }
    setAdding(false);
  };

  const productImages = product?.images && product.images.length > 0
    ? product.images
    : [PLACEHOLDER_IMAGE];

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-card rounded w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl h-96" />
          <div className="space-y-4">
            <div className="bg-card rounded-xl h-8 w-3/4" />
            <div className="bg-card rounded-xl h-12 w-1/2" />
            <div className="bg-card rounded-xl h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
        <Button onClick={() => router.push('/booster/products')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/booster" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/booster/products" className="hover:text-white transition-colors">Products</Link>
        <ChevronRight size={14} />
        <span className="text-white truncate max-w-[200px]">{product.title}</span>
      </nav>

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-card rounded-xl overflow-hidden aspect-square flex items-center justify-center border border-[#2a2a2a]">
            <img
              src={productImages[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnail strip */}
          {productImages.length > 1 && (
            <div className="flex gap-2 mt-3">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-primary' : 'border-[#2a2a2a] hover:border-[#444]'
                  }`}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          {/* Category and Server Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-medium">
              {product.category}
            </span>
            {product.server && (
              <span className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 ${serverColors[product.server] || 'bg-accent/20 text-accent border border-accent/30'}`}>
                <Globe size={12} />
                {product.server} Server
              </span>
            )}
          </div>

          {/* Trusted Seller Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded-full font-medium">
              <Shield size={12} />
              Trusted Seller
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{product.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-muted line-through text-lg">{formatPrice(product.originalPrice)}</span>
                <span className="bg-accent text-white text-sm font-bold px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <div className="flex gap-6 text-sm text-muted mb-6">
            <span>Stock: <strong className="text-white">{product.stock}</strong></span>
            <span>Sold: <strong className="text-white">{product.sold}</strong></span>
          </div>

          <div className="flex gap-3 mb-4">
            <Button size="lg" onClick={addToCart} disabled={adding || product.stock === 0}>
              {added ? (
                <><Check size={18} className="mr-2" /> Added!</>
              ) : adding ? (
                'Adding...'
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <><ShoppingCart size={18} className="mr-2" /> Add to Cart</>
              )}
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={() => {
                addToCart().then(() => router.push('/booster/cart'));
              }}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
          </div>

          {/* Instant Delivery & 24/7 Support Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-2.5">
              <Zap size={16} className="text-gold" />
              <span className="text-sm text-white font-medium">Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-2.5">
              <Headphones size={16} className="text-primary" />
              <span className="text-sm text-white font-medium">24/7 Support</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-[#161616] rounded-xl p-6 border border-[#2a2a2a]">
              <h2 className="text-lg font-bold text-white mb-3">Description</h2>
              <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Game Account Details */}
      {(product.accountCode || product.accountType || product.level || product.rank || product.gameCoins) && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Account Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {product.accountCode && (
              <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center text-center gap-2">
                <Hash size={20} className="text-primary" />
                <span className="text-xs text-muted">Account Code</span>
                <span className="text-sm font-semibold text-white">{product.accountCode}</span>
              </div>
            )}
            {product.accountType && (
              <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center text-center gap-2">
                <Smartphone size={20} className="text-blue-400" />
                <span className="text-xs text-muted">Account Type</span>
                <span className="text-sm font-semibold text-white">{product.accountType}</span>
              </div>
            )}
            {product.level != null && (
              <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center text-center gap-2">
                <Trophy size={20} className="text-yellow-400" />
                <span className="text-xs text-muted">Level</span>
                <span className="text-sm font-semibold text-white">{product.level}</span>
              </div>
            )}
            {product.rank && (
              <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center text-center gap-2">
                <Shield size={20} className="text-purple-400" />
                <span className="text-xs text-muted">Rank</span>
                <span className="text-sm font-semibold text-white">{product.rank}</span>
              </div>
            )}
            {product.gameCoins != null && (
              <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center text-center gap-2">
                <Coins size={20} className="text-gold" />
                <span className="text-xs text-muted">Game Coins</span>
                <span className="text-sm font-semibold text-white">{product.gameCoins.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weapon Skins */}
      {product.weaponSkins && product.weaponSkins.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Crosshair size={20} className="text-primary" /> Weapon Skins
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {product.weaponSkins.map((skin, i) => (
              <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
                {skin.image && (
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-[#111]">
                    <img src={skin.image} alt={skin.skinName} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-white font-semibold text-sm">{skin.weaponName}</p>
                <p className="text-muted text-xs mt-0.5">{skin.skinName}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[skin.tier] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                  {skin.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Character Skins */}
      {product.characterSkins && product.characterSkins.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <User size={20} className="text-primary" /> Character Skins
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {product.characterSkins.map((skin, i) => (
              <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
                {skin.image && (
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-[#111]">
                    <img src={skin.image} alt={skin.characterName} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-white font-semibold text-sm">{skin.characterName}</p>
                {skin.rarity && (
                  <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${rarityColors[skin.rarity] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                    {skin.rarity}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Related Products</h2>
            <Link
              href={`/booster/products?category=${product.category}`}
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp._id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
