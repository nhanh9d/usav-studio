'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarClock, MessageCircle, ShoppingCart, UserPlus, X } from 'lucide-react';
import { formatDay, formatTime } from '@/lib/shifts';
import { cn, formatPrice } from '@/lib/utils';
import { IAdminOrder, IOrder } from '@/types';
import { intlLocale } from '@/lib/boosterI18n';
import { useLocale } from '@/components/booster/LocaleProvider';

const STATUSES: IOrder['status'][] = ['pending', 'processing', 'completed', 'cancelled'];
const statusStyles: Record<IOrder['status'], string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/15 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
};
const KINDS: { id: string; label: 'all' | 'sessions' | 'purchases' }[] = [
  { id: '', label: 'all' },
  { id: 'session', label: 'sessions' },
  { id: 'purchase', label: 'purchases' },
];

export default function AdminOrdersPage() {
  const { locale, t } = useLocale();
  const slot = (start: string, end: string) =>
    `${formatDay(start, locale)} · ${formatTime(start, locale)}–${formatTime(end, locale)}`;
  const [orders, setOrders] = useState<IAdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (kind) params.set('kind', kind);
    if (status) params.set('status', status);
    return fetch(`/api/admin/orders?${params}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [kind, status]);

  useEffect(() => {
    load();
  }, [load]);

  // Adds the order to a booster's shift, or takes it off one (see /api/admin/shifts), then reloads the list.
  const updateAssignment = async (shiftId: string, orderId: string, action: 'assign' | 'unassign') => {
    setError('');
    const res = await fetch('/api/admin/shifts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shiftId, orderId, action }),
    });
    if (!res.ok) {
      setError(t.adminOrders.assignFailed);
      return;
    }
    load();
  };

  const changeStatus = async (orderId: string, next: IOrder['status']) => {
    setError('');
    const res = await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: next }),
    });
    if (!res.ok) {
      setError(t.adminOrders.updateFailed);
      return;
    }
    setOrders((list) => list.map((o) => (o._id === orderId ? { ...o, status: next } : o)));
  };

  const filterButton = (active: boolean) =>
    cn(
      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
      active ? 'bg-primary/15 text-white border-primary/40' : 'text-muted border-[#2a2a2a] hover:text-white'
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <ShoppingCart className="text-primary" size={26} />
        {t.adminOrders.title}
      </h1>
      <p className="text-muted text-sm mt-1">
        {t.adminOrders.intro}{' '}
        <Link href="/booster/admin/shifts" className="text-primary hover:underline">{t.adminOrders.shiftsLink}</Link>.
      </p>

      <div className="flex flex-wrap gap-2 mt-6">
        {KINDS.map((k) => (
          <button key={k.id} onClick={() => setKind(k.id)} className={filterButton(kind === k.id)}>
            {t.adminOrders[k.label]}
          </button>
        ))}
        <span className="w-px bg-[#2a2a2a] mx-1" aria-hidden="true" />
        <button onClick={() => setStatus('')} className={filterButton(status === '')}>{t.adminOrders.anyStatus}</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={filterButton(status === s)}>
            {t.common.status[s]}
          </button>
        ))}
      </div>

      {error && <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-card rounded-xl h-28 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-muted">{t.adminOrders.noMatch}</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => {
            const customer = order.userId;
            const session = order.kind === 'session';
            return (
              <li key={order._id} className="bg-card rounded-xl p-5 border border-[#2a2a2a]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-white font-semibold">{customer?.name || t.common.deletedUser}</span>
                      <span className="text-muted text-xs">#{order._id.slice(-6).toUpperCase()}</span>
                      <span
                        className={cn(
                          'text-[11px] px-2 py-0.5 rounded-full font-medium',
                          session ? 'bg-accent/15 text-accent' : 'bg-[#2a2a2a] text-[#ccc]'
                        )}
                      >
                        {session ? t.common.sessionRequest : t.common.purchase}
                      </span>
                    </div>
                    <p className="text-muted text-xs mt-1">{t.adminOrders.placed(new Date(order.createdAt).toLocaleString(locale === 'vi' ? intlLocale.vi : 'en-GB'))}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => changeStatus(order._id, e.target.value as IOrder['status'])}
                    aria-label={t.adminOrders.statusLabel}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-sm font-medium focus:outline-none [color-scheme:dark] bg-transparent',
                      statusStyles[order.status]
                    )}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-[#1a1a1a] text-white">
                        {t.common.status[s]}
                      </option>
                    ))}
                  </select>
                </div>

                {session ? (
                  <div className="mt-3 space-y-1.5">
                    {order.requestedStart && order.requestedEnd && (
                      <p className="text-sm text-white flex items-center gap-2">
                        <CalendarClock size={15} className="text-primary" />
                        {slot(order.requestedStart, order.requestedEnd)}
                      </p>
                    )}
                    {order.description && <p className="text-sm text-[#ccc] whitespace-pre-line">{order.description}</p>}
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-[#ccc]">
                    {order.items.map((item, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {item.title} × {item.quantity}
                      </span>
                    ))}
                    <span className="text-white font-semibold"> · {formatPrice(order.total)}</span>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
                  {order.shifts.length > 0 ? (
                    order.shifts.map((s) => (
                      <span key={s._id} className="text-primary inline-flex items-center gap-1">
                        {t.adminOrders.assignedTo(s.booster, slot(s.start, s.end))}
                        <button
                          onClick={() => updateAssignment(s._id, order._id, 'unassign')}
                          className="text-muted hover:text-red-400 transition-colors"
                          aria-label={t.adminOrders.unassign}
                          title={t.adminOrders.unassign}
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">{t.adminOrders.notAssigned}</span>
                  )}
                  {customer?.discordId && (
                    <a
                      href={`https://discord.com/users/${customer.discordId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#8b95f7] hover:text-[#a5adff]"
                    >
                      <MessageCircle size={13} />
                      {t.common.messageOnDiscord}
                    </a>
                  )}
                </div>

                {order.candidates && (
                  <div className="mt-4 pt-3 border-t border-[#2a2a2a]">
                    <p className="text-xs text-muted mb-2">{t.adminOrders.available}</p>
                    {order.candidates.length === 0 ? (
                      <p className="text-xs text-muted italic">{t.adminOrders.noCandidates}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {order.candidates.map((c) => (
                          <button
                            key={c._id}
                            onClick={() => updateAssignment(c._id, order._id, 'assign')}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors',
                              c.covers
                                ? 'border-primary/40 bg-primary/10 text-white hover:bg-primary/20'
                                : 'border-[#333] text-[#ccc] hover:text-white hover:bg-[#1a1a1a]'
                            )}
                          >
                            <UserPlus size={13} className={c.covers ? 'text-primary' : ''} />
                            <span className="font-semibold">{c.booster}</span>
                            <span className="text-muted">
                              {formatTime(c.start, locale)}–{formatTime(c.end, locale)} · {t.common.customers(c.customers)}
                              {!c.covers && ` · ${t.adminOrders.partly}`}
                            </span>
                            <span className="text-primary font-medium">{t.adminOrders.assign}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
