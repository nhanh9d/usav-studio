'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lock, ShoppingCart, CreditCard, Check, Building2, FileText } from 'lucide-react';
import Button from '@/components/booster/ui/Button';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/types';
import { cn } from '@/lib/utils';

interface CartItemData {
  productId: IProduct;
  quantity: number;
}

const paymentMethods = [
  { id: 'bank_transfer', label: 'Bank Transfer', desc: 'Transfer to our bank account', icon: Building2 },
  { id: 'ewallet', label: 'E-Wallet', desc: 'Pay via digital wallet', icon: CreditCard },
  { id: 'balance', label: 'Account Balance', desc: 'Pay from your USAV balance', icon: CreditCard },
];

const steps = [
  { id: 1, label: 'Cart', icon: ShoppingCart },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Confirmation', icon: Check },
];

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  const currentStep = orderComplete ? 3 : 2;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/booster/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/cart')
        .then((res) => res.json())
        .then((data) => {
          const cartItems = data.cart?.items || [];
          if (cartItems.length === 0) router.push('/booster/cart');
          setItems(cartItems);
          setLoading(false);
        });
    }
  }, [status]);

  const total = items.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const handleOrder = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod, notes: orderNotes }),
      });

      if (res.ok) {
        setOrderComplete(true);
      }
    } catch {
      // handle error
    }
    setProcessing(false);
  };

  if (orderComplete) {
    return (
      <div>
        {/* Step Indicator */}
        <StepIndicator currentStep={3} />

        <div className="text-center py-20">
          <CheckCircle size={60} className="text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Order Placed!</h1>
          <p className="text-muted mb-6">Thank you for your purchase. Your order is being processed.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push('/booster/account/orders')}>View Orders</Button>
            <Button variant="secondary" onClick={() => router.push('/booster/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="bg-card rounded-xl h-96 animate-pulse" />;
  }

  return (
    <div>
      {/* Secure Checkout Badge */}
      <div className="flex items-center gap-2 mb-4">
        <Lock size={16} className="text-primary" />
        <span className="text-sm font-medium text-primary">Secure Checkout</span>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method */}
          <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
            <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-lg border transition-colors text-left',
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/10'
                        : 'border-[#333] hover:border-[#555]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                        paymentMethod === method.id ? 'border-primary' : 'border-[#555]'
                      )}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <IconComponent size={18} className={paymentMethod === method.id ? 'text-primary' : 'text-muted'} />
                    <div>
                      <p className="text-white font-medium text-sm">{method.label}</p>
                      <p className="text-muted text-xs">{method.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bank Transfer Details */}
          {paymentMethod === 'bank_transfer' && (
            <div className="bg-[#161616] rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={18} className="text-primary" />
                <h2 className="text-lg font-bold text-white">Bank Transfer Details</h2>
              </div>
              <p className="text-muted text-sm mb-4">
                Please transfer the exact amount to the following bank account:
              </p>
              <div className="space-y-3 bg-card rounded-lg p-4 border border-[#2a2a2a]">
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">Bank Name</span>
                  <span className="text-white font-medium text-sm">Vietcombank (VCB)</span>
                </div>
                <div className="border-t border-[#2a2a2a]" />
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">Account Number</span>
                  <span className="text-white font-mono font-medium text-sm">1234 5678 9012</span>
                </div>
                <div className="border-t border-[#2a2a2a]" />
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">Account Holder</span>
                  <span className="text-white font-medium text-sm">USAV TRADING CO., LTD</span>
                </div>
                <div className="border-t border-[#2a2a2a]" />
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">Amount</span>
                  <span className="text-primary font-bold">{formatPrice(total)}</span>
                </div>
              </div>
              <p className="text-xs text-muted mt-3">
                * Please include your order ID in the transfer note. Your order will be processed after payment confirmation.
              </p>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
            <h2 className="text-lg font-bold text-white mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId._id} className="flex items-center justify-between py-2 border-b border-[#222] last:border-0">
                  <div>
                    <p className="text-white text-sm">{item.productId.title}</p>
                    <p className="text-muted text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-medium">
                    {formatPrice(item.productId.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-muted" />
              <h2 className="text-lg font-bold text-white">Order Notes</h2>
            </div>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Add any special instructions or notes for your order (optional)"
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl p-6 border border-[#2a2a2a] h-fit sticky top-24">
          <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="text-white">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Processing Fee</span>
              <span className="text-primary">Free</span>
            </div>
            <div className="border-t border-[#333] pt-3 flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-primary font-bold text-lg">{formatPrice(total)}</span>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={handleOrder} disabled={processing}>
            {processing ? 'Processing...' : `Pay ${formatPrice(total)}`}
          </Button>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted">
            <Lock size={12} />
            <span>Secured with SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                  isCompleted
                    ? 'bg-primary border-primary text-white'
                    : isActive
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-[#333] bg-card text-muted'
                )}
              >
                {isCompleted ? (
                  <Check size={18} />
                ) : (
                  <StepIcon size={16} />
                )}
              </div>
              <span
                className={cn(
                  'text-xs mt-1.5 font-medium',
                  isActive || isCompleted ? 'text-primary' : 'text-muted'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-16 md:w-24 h-0.5 mx-2 mb-5',
                  step.id < currentStep ? 'bg-primary' : 'bg-[#333]'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
