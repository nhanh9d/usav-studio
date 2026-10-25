'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Wallet, CreditCard, Building2, QrCode, Check } from 'lucide-react';
import Button from '@/components/booster/ui/Button';
import { formatPrice } from '@/lib/utils';

const amounts = [10, 20, 50, 100, 200, 500];

const methods = [
  { id: 'bank_transfer', label: 'Bank Transfer', desc: 'Transfer to our bank account', icon: Building2 },
  { id: 'ewallet', label: 'E-Wallet', desc: 'MoMo, ZaloPay, VNPay', icon: QrCode },
  { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard', icon: CreditCard },
];

export default function TopUpPage() {
  const { status } = useSession();
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/booster/auth/signin');
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="bg-card rounded-xl h-96 animate-pulse" />;
  }

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Top-Up Request Submitted</h1>
        <p className="text-muted mb-6">
          Your top-up of {formatPrice(finalAmount)} is being processed. Funds will be added to your balance shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push('/booster/account')}>Back to Account</Button>
          <Button variant="secondary" onClick={() => setSubmitted(false)}>Top Up Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Wallet size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Top Up Balance</h1>
          <p className="text-muted text-sm">Add funds to your USAV wallet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Selection */}
          <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
            <h2 className="text-lg font-bold text-white mb-4">Select Amount</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                  className={`p-4 rounded-lg border text-center font-bold transition-colors ${
                    selectedAmount === amount && !customAmount
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-[#333] text-white hover:border-[#555]'
                  }`}
                >
                  {formatPrice(amount)}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Or enter custom amount</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount..."
                min="1"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
            <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>
            <div className="space-y-3">
              {methods.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors text-left ${
                      method === m.id
                        ? 'border-primary bg-primary/10'
                        : 'border-[#333] hover:border-[#555]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === m.id ? 'border-primary' : 'border-[#555]'
                    }`}>
                      {method === m.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <Icon size={18} className={method === m.id ? 'text-primary' : 'text-muted'} />
                    <div>
                      <p className="text-white font-medium text-sm">{m.label}</p>
                      <p className="text-muted text-xs">{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bank Transfer Details */}
          {method === 'bank_transfer' && (
            <div className="bg-[#161616] rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={18} className="text-primary" />
                <h2 className="text-lg font-bold text-white">Bank Transfer Details</h2>
              </div>
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
                  <span className="text-muted text-sm">Transfer Note</span>
                  <span className="text-gold font-mono font-medium text-sm">TOPUP [your email]</span>
                </div>
              </div>
              <p className="text-xs text-muted mt-3">
                * Include your registered email in the transfer note. Balance will be updated within 15 minutes after confirmation.
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl p-6 border border-[#2a2a2a] h-fit sticky top-24">
          <h2 className="text-lg font-bold text-white mb-4">Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Top-Up Amount</span>
              <span className="text-white">{formatPrice(finalAmount || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Processing Fee</span>
              <span className="text-primary">Free</span>
            </div>
            <div className="border-t border-[#333] pt-3 flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-primary font-bold text-lg">{formatPrice(finalAmount || 0)}</span>
            </div>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => setSubmitted(true)}
            disabled={!finalAmount || finalAmount <= 0}
          >
            Confirm Top-Up
          </Button>
          <p className="text-center text-xs text-muted mt-3">
            Balance is typically updated within 15 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
