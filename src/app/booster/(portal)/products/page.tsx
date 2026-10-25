'use client';
import { Suspense } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Package } from 'lucide-react';
import ProductGrid from '@/components/booster/products/ProductGrid';
import Sidebar from '@/components/booster/layout/Sidebar';
import { IProduct } from '@/types';

const BANNER_IMAGE = '/images/control-room-wide.jpg';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'best_selling';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_selling', label: 'Best Selling' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'best_selling':
        sorted.sort((a, b) => b.sold - a.sold);
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return sorted;
  }, [products, sortBy]);

  return (
    <div>
      {/* Banner */}
      <div className="relative h-32 md:h-48 rounded-xl overflow-hidden mb-6">
        <img
          src={BANNER_IMAGE}
          alt="Products Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 md:px-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
            </h1>
            <p className="text-muted text-sm md:text-base">Find the best deals for Delta Force</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar activeCategory={category} onCategoryChange={setCategory} />

        <div className="flex-1">
          {/* Toolbar: product count + sort */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Package size={16} />
              <span>
                Showing <strong className="text-white">{sortedProducts.length}</strong> products
              </span>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-card border border-[#2a2a2a] rounded-lg px-4 py-2 pr-9 text-sm text-white focus:outline-none focus:border-primary cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={sortedProducts} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div>
        <div className="h-32 md:h-48 bg-card rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
