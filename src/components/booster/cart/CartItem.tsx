'use client';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/types';

interface CartItemProps {
  product: IProduct;
  quantity: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ product, quantity, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 bg-card rounded-xl p-4 border border-[#2a2a2a]">
      <div className="w-20 h-20 bg-[#161616] rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-muted text-2xl">📦</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white text-sm font-medium truncate">{product.title}</h3>
        <p className="text-primary font-bold mt-1">{formatPrice(product.price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(product._id, Math.max(1, quantity - 1))}
          className="w-8 h-8 flex items-center justify-center bg-[#2a2a2a] rounded-lg text-white hover:bg-[#333] transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="text-white text-sm w-8 text-center">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(product._id, quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-[#2a2a2a] rounded-lg text-white hover:bg-[#333] transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="text-right">
        <p className="text-white font-bold">{formatPrice(product.price * quantity)}</p>
        <button
          onClick={() => onRemove(product._id)}
          className="text-red-400 hover:text-red-300 mt-1 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
