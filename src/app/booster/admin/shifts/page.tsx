'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarClock, Clock, GripVertical, Repeat, Users, X } from 'lucide-react';
import Button from '@/components/booster/ui/Button';
import Modal from '@/components/booster/ui/Modal';
import CustomerList from '@/components/booster/shifts/CustomerList';
import WeekNav from '@/components/booster/shifts/WeekNav';
import { addDays, formatDay, formatTime, HOUR_MS, isSameDay, startOfWeek } from '@/lib/shifts';
import { intlLocale } from '@/lib/boosterI18n';
import { cn, formatPrice } from '@/lib/utils';
import { IOpenOrder, IShift, IShiftOrder } from '@/types';
import { useLocale } from '@/components/booster/LocaleProvider';

type Booster = { _id: string; name: string };
type Span = { start: string | Date; end: string | Date };

const overlaps = (a: Span, b: Span) => new Date(a.start) < new Date(b.end) && new Date(a.end) > new Date(b.start);
const covers = (shift: Span, req: Span) =>
  new Date(shift.start) <= new Date(req.start) && new Date(shift.end) >= new Date(req.end);
const requestSpan = (o: IShiftOrder) =>
  o.requestedStart && o.requestedEnd ? { start: o.requestedStart, end: o.requestedEnd } : null;

// A week schedule: one row per booster, one column per day, with the session requests still waiting for a booster
// in a sidebar. Drag a request onto a shift to assign it, or click it to highlight the shifts that fit; clicking a
// shift opens it to assign or remove customers.
export default function AdminShiftsPage() {
  const { locale, t } = useLocale();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [shifts, setShifts] = useState<IShift[]>([]);
  const [openOrders, setOpenOrders] = useState<IOpenOrder[]>([]);
  const [boosters, setBoosters] = useState<Booster[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<IOpenOrder | null>(null);
  const [dragging, setDragging] = useState<IOpenOrder | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [openShiftId, setOpenShiftId] = useState<string | null>(null);
  const [picked, setPicked] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams({ from: weekStart.toISOString(), to: addDays(weekStart, 7).toISOString() });
    return fetch(`/api/admin/shifts?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setShifts(data.shifts || []);
        setOpenOrders(data.openOrders || []);
        setBoosters(data.boosters || []);
      })
      .finally(() => setLoading(false));
  }, [weekStart]);

  useEffect(() => {
    load();
  }, [load]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const now = new Date();
  const intl = intlLocale[locale];
  // The request being dragged wins over the clicked one for highlighting.
  const highlighted = dragging ?? selectedRequest;
  const highlightSpan = highlighted && requestSpan(highlighted);

  // Session requests nobody has taken yet, soonest first, grouped by day.
  const waitingByDay = useMemo(() => {
    const waiting = openOrders
      .filter((o) => o.kind === 'session' && !o.assigned && requestSpan(o))
      .sort((a, b) => new Date(a.requestedStart!).getTime() - new Date(b.requestedStart!).getTime());
    const groups: { day: string; orders: IOpenOrder[] }[] = [];
    for (const order of waiting) {
      const day = formatDay(order.requestedStart!, locale);
      if (groups.at(-1)?.day === day) groups.at(-1)!.orders.push(order);
      else groups.push({ day, orders: [order] });
    }
    return groups;
  }, [openOrders, locale]);
  const waitingCount = waitingByDay.reduce((n, g) => n + g.orders.length, 0);

  // Every booster gets a row, plus anyone else (e.g. an admin) who has a shift this week.
  const rows = useMemo(() => {
    const byId = new Map<string, Booster>(boosters.map((b) => [b._id, b]));
    for (const s of shifts) {
      if (typeof s.boosterId === 'object' && !byId.has(s.boosterId._id)) byId.set(s.boosterId._id, s.boosterId);
    }
    return [...byId.values()].map((booster) => ({
      booster,
      shifts: shifts.filter((s) => (typeof s.boosterId === 'object' ? s.boosterId._id : s.boosterId) === booster._id),
    }));
  }, [boosters, shifts]);

  const openShift = shifts.find((s) => s._id === openShiftId) || null;

  const selectRequest = (order: IOpenOrder) => {
    if (selectedRequest?._id === order._id) {
      setSelectedRequest(null);
      return;
    }
    setSelectedRequest(order);
    setWeekStart(startOfWeek(new Date(order.requestedStart!)));
  };

  const openShiftDialog = (shift: IShift) => {
    setError('');
    setOpenShiftId(shift._id);
    // Pre-pick the highlighted request when it can go in this shift.
    const fits = highlightSpan && overlaps(shift, highlightSpan) && !shift.orders.some((o) => o._id === highlighted!._id);
    setPicked(fits ? highlighted!._id : '');
  };

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
    const { shift } = await res.json();
    setShifts((current) => current.map((s) => (s._id === shift._id ? shift : s)));
    setPicked('');
    if (action === 'assign' && selectedRequest?._id === orderId) setSelectedRequest(null);
    // Refresh which requests are still waiting.
    load();
  };

  const dropOn = (shift: IShift) => {
    const order = dragging;
    setDragging(null);
    setDropTarget(null);
    if (order && !shift.orders.some((o) => o._id === order._id)) updateAssignment(shift._id, order._id, 'assign');
  };

  const orderLabel = (order: IShiftOrder) => {
    const head = `#${order._id.slice(-6).toUpperCase()} · ${order.userId?.name || t.common.deletedUser}`;
    const span = requestSpan(order);
    if (order.kind === 'session' && span) {
      return `${head} · ${formatDay(span.start, locale)} ${formatTime(span.start, locale)}–${formatTime(span.end, locale)}`;
    }
    return `${head} · ${order.items.map((i) => i.title).join(', ')} · ${formatPrice(order.total)}`;
  };

  const hours = (list: IShift[]) =>
    Math.round((list.reduce((sum, s) => sum + new Date(s.end).getTime() - new Date(s.start).getTime(), 0) / HOUR_MS) * 10) / 10;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarClock className="text-primary" size={26} />
            {t.adminShifts.title}
          </h1>
          <p className="text-muted text-sm mt-1 max-w-2xl">{t.adminShifts.intro}</p>
        </div>
        <WeekNav weekStart={weekStart} onChange={setWeekStart} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] items-start">
        {/* Schedule */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs mb-2 min-h-5">
            {highlighted ? (
              <>
                <span className="text-white">{t.adminShifts.showingFor(highlighted.userId?.name || t.common.deletedUser)}</span>
                <Legend className="bg-primary/30 ring-2 ring-primary" label={t.adminShifts.legendCovers} />
                <Legend className="bg-amber-500/20 ring-1 ring-amber-400" label={t.adminShifts.legendPartly} />
                {selectedRequest && !dragging && (
                  <button onClick={() => setSelectedRequest(null)} className="inline-flex items-center gap-1 text-muted hover:text-white">
                    <X size={13} />
                    {t.adminShifts.clear}
                  </button>
                )}
              </>
            ) : (
              <>
                <Legend className="bg-primary/25 border-l-2 border-primary" label={t.adminShifts.legendCustomers} />
                <Legend className="border border-dashed border-[#555]" label={t.adminShifts.legendEmpty} />
              </>
            )}
          </div>

          {loading ? (
            <div className="bg-card rounded-xl h-96 animate-pulse" />
          ) : rows.length === 0 ? (
            <div className="bg-card rounded-xl p-10 border border-[#2a2a2a] text-center text-muted">{t.adminShifts.none}</div>
          ) : (
            <div className="bg-card rounded-xl border border-[#2a2a2a] overflow-x-auto">
              <div className="min-w-[720px] grid grid-cols-[140px_repeat(7,minmax(80px,1fr))]">
                {/* Header */}
                <div className="px-3 py-3 text-xs text-muted border-b border-[#2a2a2a]">{t.adminShifts.booster}</div>
                {days.map((day) => {
                  const today = isSameDay(day, now);
                  const requestDay = highlightSpan && isSameDay(day, new Date(highlightSpan.start));
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn('px-2 py-3 text-center border-b border-l border-[#2a2a2a]', requestDay && 'bg-primary/10')}
                    >
                      <p className={cn('text-xs uppercase', today ? 'text-primary' : 'text-muted')}>
                        {day.toLocaleDateString(intl, { weekday: 'short' })}
                      </p>
                      <p className={cn('text-sm font-semibold', today ? 'text-primary' : 'text-white')}>{day.getDate()}</p>
                    </div>
                  );
                })}

                {/* One row per booster */}
                {rows.map(({ booster, shifts: own }) => (
                  <div key={booster._id} className="contents">
                    <div className="px-3 py-3 border-b border-[#2a2a2a] flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {booster.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-white font-medium truncate">
                          {booster.name || t.adminShifts.unknownBooster}
                        </span>
                        <span className="block text-[11px] text-muted">{t.adminShifts.hours(hours(own))}</span>
                      </span>
                    </div>
                    {days.map((day) => {
                      const dayShifts = own.filter((s) => isSameDay(new Date(s.start), day));
                      const requestDay = highlightSpan && isSameDay(day, new Date(highlightSpan.start));
                      return (
                        <div
                          key={day.toISOString()}
                          className={cn('p-1.5 border-b border-l border-[#2a2a2a] space-y-1.5 min-h-[64px]', requestDay && 'bg-primary/5')}
                        >
                          {dayShifts.map((shift) => {
                            const fit = highlightSpan && overlaps(shift, highlightSpan);
                            const full = fit && covers(shift, highlightSpan);
                            const past = new Date(shift.end) < now;
                            return (
                              <button
                                key={shift._id}
                                data-shift={shift._id}
                                onClick={() => openShiftDialog(shift)}
                                onDragOver={(e) => {
                                  if (!dragging) return;
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = 'link';
                                  setDropTarget(shift._id);
                                }}
                                onDragLeave={() => setDropTarget((id) => (id === shift._id ? null : id))}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  dropOn(shift);
                                }}
                                className={cn(
                                  'w-full rounded-md px-1.5 py-1.5 text-left transition-colors',
                                  shift.orders.length > 0
                                    ? 'bg-primary/20 border-l-2 border-primary hover:bg-primary/30'
                                    : 'border border-dashed border-[#555] hover:bg-white/5',
                                  past && !highlightSpan && 'opacity-50',
                                  highlightSpan && !fit && 'opacity-25',
                                  full && 'ring-2 ring-primary bg-primary/30',
                                  fit && !full && 'ring-1 ring-amber-400 bg-amber-500/15',
                                  dropTarget === shift._id && 'ring-2 ring-white opacity-100 scale-[1.03]'
                                )}
                              >
                                <span className="block text-[11px] font-semibold text-white whitespace-nowrap">
                                  {formatTime(shift.start, locale)}–{formatTime(shift.end, locale)}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-muted mt-0.5">
                                  <Users size={11} />
                                  {shift.orders.length}
                                  {shift.seriesId && <Repeat size={10} className="ml-auto opacity-60" />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Waiting requests; shown above the schedule on narrow screens */}
        <aside className="order-first xl:order-last bg-card rounded-xl border border-[#2a2a2a] p-4 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
          <h2 className="text-sm font-semibold text-white">{t.adminShifts.waiting(waitingCount)}</h2>
          <p className="text-xs text-muted mt-1 mb-3">{waitingCount ? t.adminShifts.dragHint : t.adminShifts.noWaiting}</p>
          {error && !openShift && (
            <div className="mb-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2.5 rounded-lg">{error}</div>
          )}
          <div className="space-y-4">
            {waitingByDay.map((group) => (
              <div key={group.day}>
                <p className="text-[11px] uppercase tracking-wide text-muted mb-1.5">{group.day}</p>
                <div className="space-y-2">
                  {group.orders.map((order) => {
                    const active = selectedRequest?._id === order._id;
                    return (
                      <button
                        key={order._id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = 'link';
                          e.dataTransfer.setData('text/plain', order._id);
                          setDragging(order);
                        }}
                        onDragEnd={() => {
                          setDragging(null);
                          setDropTarget(null);
                        }}
                        onClick={() => selectRequest(order)}
                        title={order.description}
                        className={cn(
                          'w-full text-left rounded-lg border px-2.5 py-2 text-xs transition-colors flex gap-2 cursor-grab active:cursor-grabbing',
                          active || dragging?._id === order._id
                            ? 'border-primary bg-primary/15'
                            : 'border-[#333] hover:border-[#555] hover:bg-[#1a1a1a]'
                        )}
                      >
                        <GripVertical size={14} className="text-muted shrink-0 mt-0.5" />
                        <span className="min-w-0">
                          <span className="block text-white font-semibold truncate">
                            {order.userId?.name || t.common.deletedUser}
                          </span>
                          <span className="block text-primary mt-0.5">
                            {formatTime(order.requestedStart!, locale)}–{formatTime(order.requestedEnd!, locale)}
                          </span>
                          {order.description && <span className="block text-muted mt-0.5 line-clamp-2">{order.description}</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <Modal isOpen={openShift !== null} onClose={() => setOpenShiftId(null)} title={t.adminShifts.shift}>
        {openShift && (
          <ShiftDialog
            shift={openShift}
            openOrders={openOrders}
            picked={picked}
            error={error}
            onPick={setPicked}
            onAssign={() => updateAssignment(openShift._id, picked, 'assign')}
            onRemove={(orderId) => updateAssignment(openShift._id, orderId, 'unassign')}
            orderLabel={orderLabel}
          />
        )}
      </Modal>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted">
      <span className={cn('w-4 h-3 rounded-sm', className)} />
      {label}
    </span>
  );
}

interface ShiftDialogProps {
  shift: IShift;
  openOrders: IOpenOrder[];
  picked: string;
  error: string;
  onPick: (orderId: string) => void;
  onAssign: () => void;
  onRemove: (orderId: string) => void;
  orderLabel: (order: IShiftOrder) => string;
}

function ShiftDialog({ shift, openOrders, picked, error, onPick, onAssign, onRemove, orderLabel }: ShiftDialogProps) {
  const { locale, t } = useLocale();
  const booster = typeof shift.boosterId === 'object' ? shift.boosterId : null;
  const assignable = openOrders.filter((o) => !shift.orders.some((a) => a._id === o._id));
  // Session requests whose time overlaps this shift are listed first.
  const fits = assignable.filter((o) => o.kind === 'session' && requestSpan(o) && overlaps(shift, requestSpan(o)!));
  const others = assignable.filter((o) => !fits.includes(o));
  const options = (orders: IShiftOrder[]) =>
    orders.map((order) => (
      <option key={order._id} value={order._id}>
        {orderLabel(order)}
      </option>
    ));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-white font-semibold">{booster?.name || t.adminShifts.unknownBooster}</p>
        <p className="text-primary text-sm flex items-center gap-1.5">
          <Clock size={14} />
          {formatDay(shift.start, locale)} · {formatTime(shift.start, locale)} – {formatTime(shift.end, locale)}
        </p>
        {shift.seriesId && (
          <p className="text-muted text-xs mt-1 flex items-center gap-1.5">
            <Repeat size={12} />
            {t.shifts.repeats}
          </p>
        )}
        {shift.note && <p className="text-muted text-sm mt-2 whitespace-pre-line">{shift.note}</p>}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-2">{t.shifts.assignedCustomers(shift.orders.length)}</h3>
        <CustomerList orders={shift.orders} onRemove={onRemove} />
      </div>

      <div className="flex gap-2">
        <select
          value={picked}
          onChange={(e) => onPick(e.target.value)}
          className="flex-1 min-w-0 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
        >
          <option value="">{assignable.length ? t.adminShifts.choose : t.adminShifts.noOpen}</option>
          {fits.length > 0 ? (
            <>
              <optgroup label={t.adminShifts.fits}>{options(fits)}</optgroup>
              {others.length > 0 && <optgroup label={t.adminShifts.others}>{options(others)}</optgroup>}
            </>
          ) : (
            options(others)
          )}
        </select>
        <Button size="sm" disabled={!picked} onClick={onAssign}>
          {t.adminShifts.assign}
        </Button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
    </div>
  );
}
