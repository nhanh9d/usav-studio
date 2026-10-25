'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Package, Search, RefreshCw, ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle, Loader2, KeyRound } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { IOrder } from '@/types';
import Button from '@/components/booster/ui/Button';
import Image from 'next/image';

const PLACEHOLDER_IMG = '/images/booster-placeholder.svg';

const statusTabs = ['all', 'pending', 'processing', 'completed', 'cancelled'] as const;

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Clock }> = {
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock },
  processing: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Loader2 },
  completed: { color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle2 },
  cancelled: { color: 'text-red-400', bg: 'bg-red-500/20', icon: XCircle },
};

const timelineSteps = [
  { label: 'Order Placed', key: 'pending' },
  { label: 'Processing', key: 'processing' },
  { label: 'Completed', key: 'completed' },
];

function getTimelineIndex(status: string) {
  if (status === 'cancelled') return -1;
  const idx = timelineSteps.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default function OrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof statusTabs)[number]>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/booster/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        });
    }
  }, [status]);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = searchQuery === '' || order._id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
      <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-card rounded-xl p-1.5 border border-[#2a2a2a] mb-4 overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-muted hover:text-white hover:bg-[#2a2a2a]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === tab).length})
              </span>
            )}
            {tab === 'all' && (
              <span className="ml-1.5 text-xs opacity-70">({orders.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Search Box */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order ID..."
          className="w-full bg-card border border-[#2a2a2a] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={60} className="text-muted mx-auto mb-4" />
          <p className="text-muted text-lg">
            {searchQuery ? 'No orders matching your search' : 'No orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const isExpanded = expandedOrder === order._id;
            const timelineIdx = getTimelineIndex(order.status);

            return (
              <div key={order._id} className="bg-card rounded-xl border border-[#2a2a2a] overflow-hidden">
                {/* Order Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <StatusIcon size={18} className={config.color} />
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-muted text-xs">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${config.bg} ${config.color}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-muted" />
                      ) : (
                        <ChevronDown size={18} className="text-muted" />
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-2.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#2a2a2a] flex-shrink-0">
                          <Image
                            src={item.product?.images?.[0] || PLACEHOLDER_IMG}
                            alt={item.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white text-sm truncate block">{item.title}</span>
                          <span className="text-muted text-xs">Qty: {item.quantity}</span>
                        </div>
                        <span className="text-white text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#222] mt-3 pt-3 flex justify-between items-center">
                    <span className="text-muted text-sm">
                      Payment: {order.paymentMethod.replace('_', ' ')}
                    </span>
                    <span className="text-primary font-bold text-lg">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Expanded: Timeline + Actions */}
                {isExpanded && (
                  <div className="border-t border-[#2a2a2a] p-5 bg-[#1a1a1a]">
                    {/* Order Timeline */}
                    {order.status !== 'cancelled' ? (
                      <div className="mb-5">
                        <h4 className="text-white text-sm font-semibold mb-4">Order Timeline</h4>
                        <div className="flex items-center gap-0">
                          {timelineSteps.map((step, i) => (
                            <div key={step.key} className="flex items-center flex-1 last:flex-none">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  i <= timelineIdx
                                    ? 'bg-primary text-white'
                                    : 'bg-[#2a2a2a] text-muted'
                                }`}>
                                  {i <= timelineIdx ? (
                                    <CheckCircle2 size={16} />
                                  ) : (
                                    i + 1
                                  )}
                                </div>
                                <span className={`text-xs mt-1.5 whitespace-nowrap ${
                                  i <= timelineIdx ? 'text-primary' : 'text-muted'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                              {i < timelineSteps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${
                                  i < timelineIdx ? 'bg-primary' : 'bg-[#2a2a2a]'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                          <XCircle size={16} />
                          This order has been cancelled
                        </p>
                      </div>
                    )}

                    {/* Account Credentials for completed orders */}
                    {order.status === 'completed' && order.items.some((item) => item.accountLogin || item.accountPassword) && (
                      <div className="mb-5">
                        <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                          <KeyRound size={16} className="text-primary" />
                          Account Credentials
                        </h4>
                        <div className="space-y-2">
                          {order.items.filter((item) => item.accountLogin || item.accountPassword).map((item, idx) => (
                            <div key={idx} className="bg-[#111] border border-primary/20 rounded-lg p-4">
                              <p className="text-white text-sm font-medium mb-2">{item.title}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {item.accountLogin && (
                                  <div>
                                    <span className="text-muted text-xs block mb-0.5">Login</span>
                                    <span className="text-white text-sm font-mono bg-[#1a1a1a] px-3 py-1.5 rounded block">{item.accountLogin}</span>
                                  </div>
                                )}
                                {item.accountPassword && (
                                  <div>
                                    <span className="text-muted text-xs block mb-0.5">Password</span>
                                    <span className="text-white text-sm font-mono bg-[#1a1a1a] px-3 py-1.5 rounded block">{item.accountPassword}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reorder Button for completed orders */}
                    {order.status === 'completed' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <RefreshCw size={14} />
                        Reorder
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
