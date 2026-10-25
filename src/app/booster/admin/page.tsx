'use client';
import { useEffect, useState } from 'react';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Plus, Eye, UserCog, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { IOrder } from '@/types';

const placeholderOrders = [
  { id: 'ORD-A3F21C', customer: 'John D.', items: 2, total: 45.99, status: 'completed', date: '2026-03-09' },
  { id: 'ORD-B7E44D', customer: 'Sarah M.', items: 1, total: 19.99, status: 'processing', date: '2026-03-09' },
  { id: 'ORD-C1D88F', customer: 'Alex K.', items: 3, total: 89.50, status: 'pending', date: '2026-03-08' },
  { id: 'ORD-D9F33A', customer: 'Mike R.', items: 1, total: 12.99, status: 'completed', date: '2026-03-08' },
  { id: 'ORD-E2C77B', customer: 'Lisa W.', items: 2, total: 54.00, status: 'cancelled', date: '2026-03-07' },
];

export default function AdminPage() {
  const [productCount, setProductCount] = useState(0);
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => setProductCount(data.products?.length || 0));

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  const statsCards = [
    {
      label: 'Products',
      value: productCount,
      icon: Package,
      iconColor: 'text-primary',
      gradient: 'from-primary/10 to-primary/5',
      trend: '+3 this week',
      trendUp: true,
    },
    {
      label: 'Users',
      value: 1247,
      icon: Users,
      iconColor: 'text-accent',
      gradient: 'from-accent/10 to-accent/5',
      trend: '+12% this week',
      trendUp: true,
    },
    {
      label: 'Orders',
      value: orders.length || 328,
      icon: ShoppingCart,
      iconColor: 'text-gold',
      gradient: 'from-gold/10 to-gold/5',
      trend: '+8% this week',
      trendUp: true,
    },
    {
      label: 'Revenue',
      value: '$12,480',
      icon: DollarSign,
      iconColor: 'text-green-400',
      gradient: 'from-green-500/10 to-green-500/5',
      trend: '-2% this week',
      trendUp: false,
    },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-primary/15 via-primary/5 to-transparent rounded-2xl p-6 mb-8 border border-primary/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-accent/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">U</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, Admin</h1>
              <p className="text-muted text-sm">Here is what is happening with your store today.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-gradient-to-br ${card.gradient} bg-card rounded-xl p-5 border border-[#2a2a2a] hover:border-[#333] transition-colors`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                  <Icon size={20} className={card.iconColor} />
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${
                  card.trendUp ? 'text-green-400' : 'text-red-400'
                }`}>
                  {card.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {card.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </p>
              <p className="text-muted text-sm mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/booster/admin/products"
            className="group bg-card rounded-xl p-5 border border-[#2a2a2a] hover:border-primary/50 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
              <Plus size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Add Product</p>
              <p className="text-muted text-xs">Create a new listing</p>
            </div>
            <ArrowRight size={16} className="text-muted group-hover:text-primary transition-colors" />
          </Link>

          <Link
            href="/booster/admin/orders"
            className="group bg-card rounded-xl p-5 border border-[#2a2a2a] hover:border-accent/50 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/10 transition-colors">
              <Eye size={22} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">View Orders</p>
              <p className="text-muted text-xs">Manage customer orders</p>
            </div>
            <ArrowRight size={16} className="text-muted group-hover:text-accent transition-colors" />
          </Link>

          <Link
            href="/booster/admin/products"
            className="group bg-card rounded-xl p-5 border border-[#2a2a2a] hover:border-gold/50 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/10 transition-colors">
              <UserCog size={22} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Manage Users</p>
              <p className="text-muted text-xs">View and manage accounts</p>
            </div>
            <ArrowRight size={16} className="text-muted group-hover:text-gold transition-colors" />
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          <Link href="/booster/admin/products" className="text-primary text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-card rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left p-4 text-muted font-medium">Order ID</th>
                  <th className="text-left p-4 text-muted font-medium">Customer</th>
                  <th className="text-left p-4 text-muted font-medium">Items</th>
                  <th className="text-left p-4 text-muted font-medium">Total</th>
                  <th className="text-left p-4 text-muted font-medium">Status</th>
                  <th className="text-left p-4 text-muted font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {(orders.length > 0
                  ? orders.slice(0, 5).map((order) => ({
                      id: `ORD-${order._id.slice(-6).toUpperCase()}`,
                      customer: 'Customer',
                      items: order.items.length,
                      total: order.total,
                      status: order.status,
                      date: formatDate(order.createdAt),
                    }))
                  : placeholderOrders.map((o) => ({
                      ...o,
                      date: formatDate(o.date),
                      total: o.total,
                    }))
                ).map((order, idx) => (
                  <tr key={idx} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-4 text-white font-medium font-mono text-xs">{order.id}</td>
                    <td className="p-4 text-white">{order.customer}</td>
                    <td className="p-4 text-muted">{order.items} item{order.items > 1 ? 's' : ''}</td>
                    <td className="p-4 text-primary font-medium">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-muted">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
