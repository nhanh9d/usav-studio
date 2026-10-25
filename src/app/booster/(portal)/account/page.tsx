'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Package, Settings, Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Gift, Copy, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { IOrder } from '@/types';

const recentActivity = [
  { id: 1, type: 'purchase', label: 'Purchased Genshin Impact Account', amount: -45.99, date: '2026-03-08' },
  { id: 2, type: 'topup', label: 'Balance Top-Up via PayPal', amount: 100.0, date: '2026-03-07' },
  { id: 3, type: 'reward', label: 'Spin Wheel Reward', amount: 5.0, date: '2026-03-06' },
  { id: 4, type: 'purchase', label: 'Purchased Valorant Boost', amount: -19.99, date: '2026-03-05' },
  { id: 5, type: 'refund', label: 'Order Refund #A3F21C', amount: 12.50, date: '2026-03-04' },
];

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [copiedRef, setCopiedRef] = useState(false);

  const referralCode = 'USAV-' + (session?.user?.name?.slice(0, 4).toUpperCase() || 'USER') + '-7X3K';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/booster/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []));
    }
  }, [status]);

  const copyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  if (status === 'loading') {
    return <div className="bg-card rounded-xl h-96 animate-pulse" />;
  }

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div>
      {/* Profile Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent h-44" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-bold text-white border-4 border-header shadow-lg shadow-primary/20">
            {userInitial}
          </div>
          <div className="flex-1 mb-1">
            <h1 className="text-2xl font-bold text-white">{session?.user?.name}</h1>
            <p className="text-muted text-sm">{session?.user?.email}</p>
          </div>
          <div className="mb-1">
            <span className="inline-flex items-center gap-1.5 bg-gold/15 text-gold border border-gold/30 text-xs font-semibold px-3 py-1.5 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              Bronze Member
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center">
              <Wallet size={20} className="text-gold" />
            </div>
            <span className="text-muted text-sm">Balance</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatPrice(0)}</p>
        </div>

        <div className="bg-card rounded-xl p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
              <Package size={20} className="text-accent" />
            </div>
            <span className="text-muted text-sm">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
        </div>

        <div className="bg-card rounded-xl p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Gift size={20} className="text-primary" />
            </div>
            <span className="text-muted text-sm">Reward Points</span>
          </div>
          <p className="text-2xl font-bold text-white">250</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/booster/account/top-up" className="group bg-card rounded-xl p-5 border border-[#2a2a2a] hover:border-primary/50 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
            <CreditCard size={22} className="text-primary" />
          </div>
          <div>
            <p className="text-white font-semibold">Top Up Balance</p>
            <p className="text-muted text-xs">Add funds to your wallet</p>
          </div>
          <ChevronRight size={16} className="text-muted ml-auto group-hover:text-primary transition-colors" />
        </Link>
        <Link href="/booster/account/orders" className="group bg-card rounded-xl p-5 border border-[#2a2a2a] hover:border-accent/50 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/10 transition-colors">
            <Package size={22} className="text-accent" />
          </div>
          <div>
            <p className="text-white font-semibold">View Orders</p>
            <p className="text-muted text-xs">Track your purchases</p>
          </div>
          <ChevronRight size={16} className="text-muted ml-auto group-hover:text-accent transition-colors" />
        </Link>
        <Link href="/booster/account/settings" className="group bg-card rounded-xl p-5 border border-[#2a2a2a] hover:border-gold/50 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/10 transition-colors">
            <Settings size={22} className="text-gold" />
          </div>
          <div>
            <p className="text-white font-semibold">Settings</p>
            <p className="text-muted text-xs">Update your profile</p>
          </div>
          <ChevronRight size={16} className="text-muted ml-auto group-hover:text-gold transition-colors" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions / Activity Feed */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
          <div className="bg-card rounded-xl border border-[#2a2a2a] divide-y divide-[#2a2a2a]">
            {orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order._id} className="p-4 flex items-center gap-4 hover:bg-[#1a1a1a] transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    order.status === 'completed' ? 'bg-green-500/15' :
                    order.status === 'pending' ? 'bg-yellow-500/15' :
                    order.status === 'cancelled' ? 'bg-red-500/15' :
                    'bg-blue-500/15'
                  }`}>
                    <ArrowDownLeft size={18} className={
                      order.status === 'completed' ? 'text-green-400' :
                      order.status === 'pending' ? 'text-yellow-400' :
                      order.status === 'cancelled' ? 'text-red-400' :
                      'text-blue-400'
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-muted text-xs">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} - {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold text-sm">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-[#1a1a1a] transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.amount > 0 ? 'bg-green-500/15' : 'bg-accent/15'
                  }`}>
                    {activity.amount > 0 ? (
                      <ArrowDownLeft size={18} className="text-green-400" />
                    ) : (
                      <ArrowUpRight size={18} className="text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{activity.label}</p>
                    <p className="text-muted text-xs">{formatDate(activity.date)}</p>
                  </div>
                  <p className={`font-bold text-sm ${activity.amount > 0 ? 'text-green-400' : 'text-accent'}`}>
                    {activity.amount > 0 ? '+' : ''}{formatPrice(Math.abs(activity.amount))}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Referral Code Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Referral Program</h2>
          <div className="bg-card rounded-xl p-6 border border-[#2a2a2a]">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-5 mb-4 text-center">
              <Gift size={32} className="text-primary mx-auto mb-3" />
              <p className="text-white text-sm font-medium mb-1">Earn 10% commission</p>
              <p className="text-muted text-xs">Share your referral code with friends and earn rewards on every purchase they make.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-muted">Your Referral Code</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-gold font-mono font-bold tracking-wider">
                  {referralCode}
                </div>
                <button
                  onClick={copyReferral}
                  className="bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary rounded-lg p-2.5 transition-colors"
                >
                  {copiedRef ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <p className="text-muted text-xs text-center">
                {copiedRef ? 'Copied to clipboard!' : '0 referrals this month'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
