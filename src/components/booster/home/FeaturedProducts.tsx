'use client';
import { useEffect, useState } from 'react';
import ProductGrid from '@/components/booster/products/ProductGrid';
import { IProduct } from '@/types';
import { ShoppingBag } from 'lucide-react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=8')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Nothing to feature yet: leave the section out rather than show an empty heading.
  if (!loading && products.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag size={20} className="text-primary" />
        <h2 className="text-xl font-bold text-white">Featured</h2>
      </div>

      {/* Featured Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
