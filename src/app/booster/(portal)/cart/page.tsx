'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Zap, Tag } from 'lucide-react';
import CartItem from '@/components/booster/cart/CartItem';
import Button from '@/components/booster/ui/Button';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/types';
import Link from 'next/link';

interface CartItemData {
  productId: IProduct;
  quantity: number;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/booster/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setItems(data.cart?.items || []);
    } catch {
      // handle error
    }
    setLoading(false);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    setItems((prev) =>
      prev.map((item) =>
        item.productId._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = async (productId: string) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    setItems((prev) => prev.filter((item) => item.productId._id !== productId));
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header with Continue Shopping */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
        <Link
          href="/booster/products"
          className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-[#2a2a2a]">
          <div className="text-6xl mb-4">&#x1F3AE;</div>
          <ShoppingCart size={48} className="text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
            Looks like you haven&apos;t added any items to your cart yet. Browse our marketplace to find great deals!
          </p>
          <Link href="/booster/products">
            <Button size="lg">
              <ShoppingCart size={18} className="mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartItem
                key={item.productId._id}
                product={item.productId}
                quantity={item.quantity}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="bg-card rounded-xl p-6 border border-[#2a2a2a] h-fit sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Items ({items.length})</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>

              {/* Instant Delivery Info */}
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                <Zap size={14} className="text-primary shrink-0" />
                <span className="text-xs text-primary font-medium">Instant digital delivery</span>
              </div>

              <div className="border-t border-[#333] pt-3 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-primary font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mb-4">
              <label className="block text-sm text-muted mb-2">
                <Tag size={12} className="inline mr-1" />
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponApplied(false);
                  }}
                  placeholder="Enter code"
                  className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-[#2a2a2a] hover:bg-[#333] text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-xs text-muted mt-1">Invalid or expired coupon code</p>
              )}
            </div>

            <Link href="/booster/checkout">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
