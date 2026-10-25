'use client';
import Link from 'next/link';
import { ShoppingCart, Flame } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/types';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discount > 0;

  return (
    <Link href={`/booster/products/${product.slug}`} className="group">
      <div className="bg-card rounded-lg overflow-hidden border border-[#2a2a2a] hover:border-primary transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-[4/3] bg-[#161616] overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <ShoppingCart size={40} />
            </div>
          )}

          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}

          {product.featured && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Flame size={12} /> HOT
            </span>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-white text-sm font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary font-bold text-base">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-muted text-xs line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted">
              <span>Stock: {product.stock} accounts</span>
              <span>Sold: {product.sold}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
