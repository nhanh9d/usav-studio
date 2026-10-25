'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, ShoppingCart, Users, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

type Tab = 'orders-by-category' | 'sold-accounts' | 'purchase-history';

interface DailyRow {
  date: string;
  categories: Record<string, { count: number; revenue: number }>;
  totalCount: number;
  totalRevenue: number;
}

interface OrdersByCategoryData {
  daily: DailyRow[];
  categories: string[];
  totalOrders: number;
  totalRevenue: number;
  topCategory: string;
}

interface SoldAccountsData {
  statusBreakdown: Record<string, { count: number; revenue: number }>;
  totalSold: number;
  totalAccountProducts: number;
}

interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface OrderRecord {
  _id: string;
  userId: OrderUser | string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

interface PurchaseHistoryData {
  orders: OrderRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'orders-by-category', label: 'Orders by Category' },
  { key: 'sold-accounts', label: 'Sold Accounts' },
  { key: 'purchase-history', label: 'Purchase History' },
];

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-400',
  processing: 'bg-blue-500/20 text-blue-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Card({ title, value, subtitle, icon: Icon, color }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof BarChart3;
  color: string;
}) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted">{title}</span>
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-xs text-muted mt-1">{subtitle}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status] || 'bg-[#222] text-muted'}`}>
      {status}
    </span>
  );
}

// --- Tab 1: Orders by Category ---
function OrdersByCategoryTab() {
  const [data, setData] = useState<OrdersByCategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reports?type=orders-by-category')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data || data.daily.length === 0) return <EmptyState message="No order data for the last 30 days." />;

  const maxTotal = Math.max(...data.daily.map((d) => d.totalRevenue), 1);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total Orders" value={data.totalOrders} subtitle="Last 30 days" icon={ShoppingCart} color="bg-primary/20 text-primary" />
        <Card title="Total Revenue" value={formatCurrency(data.totalRevenue)} subtitle="Last 30 days" icon={DollarSign} color="bg-green-500/20 text-green-400" />
        <Card title="Top Category" value={data.topCategory} subtitle="By revenue" icon={BarChart3} color="bg-blue-500/20 text-blue-400" />
      </div>

      {/* Daily breakdown table */}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2a2a2a]">
          <h3 className="text-white font-semibold">Daily Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-muted">
                <th className="text-left px-5 py-3 font-medium">Date</th>
                {data.categories.map((cat) => (
                  <th key={cat} className="text-left px-5 py-3 font-medium capitalize">{cat}</th>
                ))}
                <th className="text-left px-5 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.daily.map((row) => (
                <tr key={row.date} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/50">
                  <td className="px-5 py-3 text-white whitespace-nowrap">{formatDate(row.date)}</td>
                  {data.categories.map((cat) => {
                    const val = row.categories[cat];
                    return (
                      <td key={cat} className="px-5 py-3">
                        {val ? (
                          <div>
                            <div className="text-white">{val.count} items</div>
                            <div className="text-xs text-muted">{formatCurrency(val.revenue)}</div>
                          </div>
                        ) : (
                          <span className="text-[#333]">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="min-w-[80px]">
                        <div className="text-white font-medium">{formatCurrency(row.totalRevenue)}</div>
                        <div className="text-xs text-muted">{row.totalCount} items</div>
                      </div>
                      <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(row.totalRevenue / maxTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Tab 2: Sold Accounts ---
function SoldAccountsTab() {
  const [data, setData] = useState<SoldAccountsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reports?type=sold-accounts')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return <EmptyState message="No account data available." />;

  const statuses = ['completed', 'processing', 'pending', 'cancelled'] as const;
  const progressPct = data.totalAccountProducts > 0
    ? Math.min(100, Math.round((data.totalSold / data.totalAccountProducts) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Big number card */}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted mb-1">Total Accounts Sold</div>
            <div className="text-4xl font-bold text-white">{data.totalSold}</div>
            <div className="text-sm text-muted mt-1">out of {data.totalAccountProducts} account products</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Users size={24} className="text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Progress</span>
            <span className="text-white font-medium">{progressPct}%</span>
          </div>
          <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((status) => {
          const val = data.statusBreakdown[status] || { count: 0, revenue: 0 };
          return (
            <div key={status} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={status} />
              </div>
              <div className="text-2xl font-bold text-white">{val.count}</div>
              <div className="text-sm text-muted mt-1">{formatCurrency(val.revenue)} revenue</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Tab 3: Purchase History ---
function PurchaseHistoryTab() {
  const [data, setData] = useState<PurchaseHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ type: 'purchase-history', page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/admin/reports?${params}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = (s: string) => {
    setStatusFilter(s);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted">Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : !data || data.orders.length === 0 ? (
          <EmptyState message="No orders found." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-muted">
                    <th className="text-left px-5 py-3 font-medium">Order ID</th>
                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                    <th className="text-left px-5 py-3 font-medium">Items</th>
                    <th className="text-left px-5 py-3 font-medium">Total</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((order) => {
                    const user = typeof order.userId === 'object' ? order.userId : null;
                    return (
                      <tr key={order._id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/50">
                        <td className="px-5 py-3 text-white font-mono text-xs">
                          {order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-5 py-3">
                          {user ? (
                            <div>
                              <div className="text-white">{user.name}</div>
                              <div className="text-xs text-muted">{user.email}</div>
                            </div>
                          ) : (
                            <span className="text-muted">Unknown</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-muted">
                          {order.items.map((i) => `${i.title} x${i.quantity}`).join(', ')}
                        </td>
                        <td className="px-5 py-3 text-white font-medium">{formatCurrency(order.total)}</td>
                        <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                        <td className="px-5 py-3 text-muted whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#2a2a2a]">
                <span className="text-sm text-muted">
                  Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(data!.pagination.totalPages, p + 1))}
                    disabled={page >= data.pagination.totalPages}
                    className="p-2 rounded-lg border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted">
      <BarChart3 size={40} className="mb-3 opacity-30" />
      <p>{message}</p>
    </div>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders-by-category');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-sm text-muted mt-1">Analytics and order insights</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#111] border border-[#2a2a2a] rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary/15 text-white'
                : 'text-muted hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'orders-by-category' && <OrdersByCategoryTab />}
      {activeTab === 'sold-accounts' && <SoldAccountsTab />}
      {activeTab === 'purchase-history' && <PurchaseHistoryTab />}
    </div>
  );
}
