'use client';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CalendarClock, CheckCircle2, Clock, Pencil, Plus, Repeat, Trash2, Users } from 'lucide-react';
import Button from '@/components/booster/ui/Button';
import Modal from '@/components/booster/ui/Modal';
import ShiftCalendar from '@/components/booster/shifts/ShiftCalendar';
import ShiftForm, { draftShifts, ShiftDraft } from '@/components/booster/shifts/ShiftForm';
import CustomerList from '@/components/booster/shifts/CustomerList';
import WeekNav from '@/components/booster/shifts/WeekNav';
import { addDays, formatDay, formatTime, HOUR_MS, startOfWeek, toLocalInput } from '@/lib/shifts';
import { IShift } from '@/types';
import { errorMessage } from '@/lib/boosterI18n';
import { useLocale } from '@/components/booster/LocaleProvider';

const DEFAULT_SHIFT_HOURS = 2;

// Boosters land here: /booster is rewritten to this page for them (see src/proxy.ts).
export default function ShiftsPage() {
  const { data: session } = useSession();
  const { locale, t } = useLocale();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [shifts, setShifts] = useState<IShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<IShift | null>(null);
  const [draft, setDraft] = useState<ShiftDraft | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  // Result of adding or deleting several shifts at once.
  const [notice, setNotice] = useState('');

  const loadShifts = useCallback(() => {
    const params = new URLSearchParams({ from: weekStart.toISOString(), to: addDays(weekStart, 7).toISOString() });
    return fetch(`/api/shifts?${params}`)
      .then((res) => res.json())
      .then((data) => setShifts(data.shifts || []))
      .finally(() => setLoading(false));
  }, [weekStart]);

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  const openCreate = (start: Date) => {
    setFormError('');
    setDraft({
      start: toLocalInput(start),
      end: toLocalInput(new Date(start.getTime() + DEFAULT_SHIFT_HOURS * HOUR_MS)),
      note: '',
    });
  };

  const openEdit = (shift: IShift) => {
    setSelected(null);
    setFormError('');
    setDraft({ id: shift._id, start: toLocalInput(new Date(shift.start)), end: toLocalInput(new Date(shift.end)), note: shift.note });
  };

  const openDetails = (shift: IShift) => {
    setConfirmDelete(false);
    setDeleteError('');
    setSelected(shift);
  };

  const saveShift = async (value: ShiftDraft) => {
    setSaving(true);
    setFormError('');
    setNotice('');
    // datetime-local values are local time; send absolute instants. A weekly series is expanded here, in the
    // booster's own time zone, and sent as a list.
    const body = value.repeat
      ? { shifts: draftShifts(value).map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() })), note: value.note }
      : { start: new Date(value.start).toISOString(), end: new Date(value.end).toISOString(), note: value.note };
    const res = await fetch(value.id ? `/api/shifts/${value.id}` : '/api/shifts', {
      method: value.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setFormError(errorMessage(t, data, t.shifts.saveFailed));
      return;
    }
    if (data.shifts) setNotice(t.shifts.created(data.shifts.length, data.skipped || 0));
    setDraft(null);
    loadShifts();
  };

  const deleteShift = async (shift: IShift, following = false) => {
    setNotice('');
    const res = await fetch(`/api/shifts/${shift._id}${following ? '?scope=following' : ''}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setDeleteError(errorMessage(t, data, t.shifts.deleteFailed));
      setConfirmDelete(false);
      return;
    }
    if (following) setNotice(t.shifts.deletedSeries(data.deleted || 0, data.kept || 0));
    setSelected(null);
    loadShifts();
  };

  const totalHours = shifts.reduce((sum, s) => sum + (new Date(s.end).getTime() - new Date(s.start).getTime()) / HOUR_MS, 0);
  const totalCustomers = new Set(shifts.flatMap((s) => s.orders.map((o) => o._id))).size;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarClock className="text-primary" size={26} />
            {t.shifts.title}
          </h1>
          <p className="text-muted text-sm mt-1">
            {t.shifts.welcome(session?.user?.name)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => openCreate(nextFullHour())} className="gap-2">
            <Plus size={16} />
            {t.shifts.add}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Stat icon={<CalendarClock size={18} />} label={t.shifts.statShifts} value={shifts.length} />
        <Stat icon={<Clock size={18} />} label={t.shifts.statHours} value={Math.round(totalHours * 10) / 10} />
        <Stat icon={<Users size={18} />} label={t.shifts.statCustomers} value={totalCustomers} />
      </div>

      {notice && (
        <div className="mb-4 bg-primary/10 border border-primary/30 text-primary text-sm p-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          {notice}
        </div>
      )}

      <div className="mb-4">
        <WeekNav weekStart={weekStart} onChange={setWeekStart} />
      </div>

      {loading ? (
        <div className="bg-card rounded-xl h-[calc(100dvh-12rem)] min-h-[420px] max-h-[860px] animate-pulse" />
      ) : (
        <ShiftCalendar weekStart={weekStart} shifts={shifts} onSelect={openDetails} onCreateAt={openCreate} />
      )}

      <Modal isOpen={draft !== null} onClose={() => setDraft(null)} title={draft?.id ? t.shifts.edit : t.shifts.add}>
        {draft && (
          <ShiftForm
            key={draft.id || draft.start}
            draft={draft}
            error={formError}
            saving={saving}
            onSubmit={saveShift}
            onCancel={() => setDraft(null)}
          />
        )}
      </Modal>

      <Modal isOpen={selected !== null} onClose={() => setSelected(null)} title={t.shifts.details}>
        {selected && (
          <div className="space-y-5">
            <div>
              <p className="text-white font-semibold">{formatDay(selected.start, locale)}</p>
              <p className="text-primary text-sm">
                {formatTime(selected.start, locale)} – {formatTime(selected.end, locale)}
                {new Date(selected.end).toDateString() !== new Date(selected.start).toDateString() &&
                  t.shifts.ends(formatDay(selected.end, locale))}
              </p>
              {selected.seriesId && (
                <p className="text-muted text-xs mt-1 flex items-center gap-1.5">
                  <Repeat size={12} />
                  {t.shifts.repeats}
                </p>
              )}
              {selected.note && <p className="text-muted text-sm mt-2 whitespace-pre-line">{selected.note}</p>}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-2">{t.shifts.assignedCustomers(selected.orders.length)}</h3>
              <CustomerList orders={selected.orders} />
            </div>

            {deleteError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">{deleteError}</div>
            )}

            {confirmDelete ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm font-medium mb-3">{t.shifts.confirmDelete}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(false)}>
                    {t.common.cancel}
                  </Button>
                  <button
                    onClick={() => deleteShift(selected)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                  >
                    {selected.seriesId ? t.shifts.deleteOnly : t.shifts.yesDelete}
                  </button>
                  {selected.seriesId && (
                    <button
                      onClick={() => deleteShift(selected, true)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                    >
                      {t.shifts.deleteFollowing}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 text-red-400 hover:bg-red-500/10 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} />
                  {t.shifts.deleteButton}
                </button>
                <Button onClick={() => openEdit(selected)} className="gap-2">
                  <Pencil size={16} />
                  {t.shifts.editButton}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function nextFullHour() {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  return d;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card rounded-xl p-4 border border-[#2a2a2a] flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary hidden sm:flex items-center justify-center shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-white text-lg font-bold leading-tight">{value}</p>
        <p className="text-muted text-xs truncate">{label}</p>
      </div>
    </div>
  );
}
