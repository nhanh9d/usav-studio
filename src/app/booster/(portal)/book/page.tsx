'use client';
import { useCallback, useEffect, useState } from 'react';
import { CalendarPlus, CheckCircle2 } from 'lucide-react';
import Button from '@/components/booster/ui/Button';
import { MAX_DESCRIPTION, validateBooking } from '@/lib/bookings';
import { errorMessage } from '@/lib/boosterI18n';
import { useLocale } from '@/components/booster/LocaleProvider';
import { formatDay, formatTime, HOUR_MS, toLocalInput } from '@/lib/shifts';
import { IOrder } from '@/types';

type Booking = Pick<IOrder, '_id' | 'status' | 'requestedStart' | 'requestedEnd' | 'description'>;

const inputClass =
  'w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]';

const statusStyles: Record<IOrder['status'], string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  processing: 'bg-blue-500/15 text-blue-400',
  completed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

// Tomorrow at 20:00 as a sensible first suggestion.
function defaultSlot() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(20, 0, 0, 0);
  return { start: toLocalInput(start), end: toLocalInput(new Date(start.getTime() + 2 * HOUR_MS)) };
}

// Buyers request a boosting/coaching session; admin assigns it to a booster's shift (see /booster/admin/shifts).
export default function BookSessionPage() {
  const { locale, t } = useLocale();
  const [form, setForm] = useState(() => ({ ...defaultSlot(), description: '' }));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = useCallback(
    () =>
      fetch('/api/bookings')
        .then((res) => res.json())
        .then((data) => setBookings(data.bookings || [])),
    []
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(form.start);
    const end = new Date(form.end);
    const problem = validateBooking(start, end, form.description);
    if (problem) {
      setError(t.errors[problem]);
      return;
    }
    setSaving(true);
    setError('');
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start: start.toISOString(), end: end.toISOString(), description: form.description }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(errorMessage(t, data, t.book.sendFailed));
      return;
    }
    setSent(true);
    setForm({ ...defaultSlot(), description: '' });
    loadBookings();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <CalendarPlus className="text-primary" size={26} />
        {t.book.title}
      </h1>
      <p className="text-muted text-sm mt-1">
        {t.book.intro}
      </p>

      <form onSubmit={submit} className="mt-6 bg-card rounded-xl p-6 border border-[#2a2a2a] space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start" className="block text-sm text-muted mb-1.5">{t.book.from}</label>
            <input
              id="start"
              type="datetime-local"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="end" className="block text-sm text-muted mb-1.5">{t.book.to}</label>
            <input
              id="end"
              type="datetime-local"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              className={inputClass}
              required
            />
          </div>
        </div>
        <p className="text-xs text-muted -mt-2">{t.book.hoursHint}</p>

        <div>
          <label htmlFor="description" className="block text-sm text-muted mb-1.5">{t.book.need}</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={MAX_DESCRIPTION}
            rows={5}
            placeholder={t.book.placeholder}
            className={`${inputClass} resize-y`}
            required
          />
          <p className="text-xs text-muted mt-1 text-right">{form.description.length}/{MAX_DESCRIPTION}</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
        {sent && !error && (
          <div className="bg-primary/10 border border-primary/30 text-primary text-sm p-3 rounded-lg flex items-center gap-2">
            <CheckCircle2 size={16} />
            {t.book.sent}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? t.book.sending : t.book.send}
          </Button>
        </div>
      </form>

      <h2 className="text-lg font-bold text-white mt-10 mb-3">{t.book.myRequests}</h2>
      {bookings.length === 0 ? (
        <p className="text-sm text-muted">{t.book.none}</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => {
            return (
              <li key={booking._id} className="bg-card rounded-xl p-4 border border-[#2a2a2a]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-white text-sm font-semibold">
                    {booking.requestedStart && booking.requestedEnd
                      ? `${formatDay(booking.requestedStart, locale)} · ${formatTime(booking.requestedStart, locale)}–${formatTime(booking.requestedEnd, locale)}`
                      : t.book.session}
                  </p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusStyles[booking.status]}`}>
                    {t.book.status[booking.status]}
                  </span>
                </div>
                {booking.description && (
                  <p className="text-muted text-sm mt-2 whitespace-pre-line">{booking.description}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
