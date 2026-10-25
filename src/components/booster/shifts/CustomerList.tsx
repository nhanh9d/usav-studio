'use client';
import { MessageCircle, X } from 'lucide-react';
import { formatDay, formatTime } from '@/lib/shifts';
import { formatPrice } from '@/lib/utils';
import { IShiftOrder } from '@/types';
import { useLocale } from '@/components/booster/LocaleProvider';

const statusStyles: Record<IShiftOrder['status'], string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  processing: 'bg-blue-500/15 text-blue-400',
  completed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

interface CustomerListProps {
  orders: IShiftOrder[];
  // Shown as a remove button on each customer when given (admin view).
  onRemove?: (orderId: string) => void;
}

export default function CustomerList({ orders, onRemove }: CustomerListProps) {
  const { locale, t } = useLocale();
  if (orders.length === 0) {
    return <p className="text-sm text-muted">{t.customers.none}</p>;
  }

  return (
    <ul className="space-y-2">
      {orders.map((order) => {
        const customer = order.userId;
        return (
          <li key={order._id} className="bg-[#1a1a1a] rounded-lg p-3 border border-[#2a2a2a]">
            <div className="flex items-start gap-3">
              {customer?.avatar ? (
                <img src={customer.avatar} alt="" className="w-9 h-9 rounded-full shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                  {customer?.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-medium truncate">{customer?.name || t.common.deletedUser}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusStyles[order.status]}`}>
                    {t.common.status[order.status]}
                  </span>
                </div>
                {order.kind === 'session' ? (
                  <>
                    <p className="text-muted text-xs mt-0.5">
                      #{order._id.slice(-6).toUpperCase()} · {t.common.sessionRequest}
                      {order.requestedStart && order.requestedEnd && (
                        <>
                          {' '}· {formatDay(order.requestedStart, locale)} {formatTime(order.requestedStart, locale)}–{formatTime(order.requestedEnd, locale)}
                        </>
                      )}
                    </p>
                    {order.description && (
                      <p className="mt-1.5 text-xs text-[#ccc] whitespace-pre-line">{order.description}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-muted text-xs mt-0.5">
                      #{order._id.slice(-6).toUpperCase()} · {formatPrice(order.total)}
                    </p>
                    <ul className="mt-1.5 text-xs text-[#ccc] space-y-0.5">
                      {order.items.map((item, i) => (
                        <li key={i}>{item.title} × {item.quantity}</li>
                      ))}
                    </ul>
                  </>
                )}
                {customer?.discordId && (
                  <a
                    href={`https://discord.com/users/${customer.discordId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#8b95f7] hover:text-[#a5adff] transition-colors"
                  >
                    <MessageCircle size={13} />
                    {t.common.messageOnDiscord}
                  </a>
                )}
              </div>
              {onRemove && (
                <button
                  onClick={() => onRemove(order._id)}
                  className="text-muted hover:text-red-400 transition-colors"
                  aria-label={t.customers.remove}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
