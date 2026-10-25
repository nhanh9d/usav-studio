'use client';
import { useState } from 'react';
import { Repeat } from 'lucide-react';
import Button from '@/components/booster/ui/Button';
import { useLocale } from '@/components/booster/LocaleProvider';
import { intlLocale } from '@/lib/boosterI18n';
import { MAX_REPEAT_WEEKS, repeatWeekly } from '@/lib/shifts';
import { cn } from '@/lib/utils';

export interface ShiftDraft {
  id?: string;
  start: string; // datetime-local value
  end: string;
  note: string;
  // New shifts only: also add copies on these weekdays (0 = Sunday) for this many weeks.
  repeat?: { days: number[]; weeks: number } | null;
}

interface ShiftFormProps {
  draft: ShiftDraft;
  error: string;
  saving: boolean;
  onSubmit: (draft: ShiftDraft) => void;
  onCancel: () => void;
}

const inputClass =
  'w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]';

// Weekdays in calendar order, Monday first, as Date.getDay numbers.
const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0];
// 1 = only the rest of the current week.
const DEFAULT_REPEAT_WEEKS = 1;

// The shifts a draft will create: one, or every copy of a weekly series.
export function draftShifts(draft: ShiftDraft) {
  const start = new Date(draft.start);
  const end = new Date(draft.end);
  if (!draft.repeat || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [{ start, end }];
  return repeatWeekly(start, end, draft.repeat.days, draft.repeat.weeks);
}

export default function ShiftForm({ draft, error, saving, onSubmit, onCancel }: ShiftFormProps) {
  const [value, setValue] = useState(draft);
  const { locale, t } = useLocale();
  const repeat = value.repeat;
  const count = draftShifts(value).length;

  // 1 Jan 2024 was a Monday, so day d of that week names weekday d.
  const weekdayName = (day: number) =>
    new Date(2024, 0, 1 + ((day + 6) % 7)).toLocaleDateString(intlLocale[locale], { weekday: 'short' });

  const toggleRepeat = (on: boolean) => {
    const startDay = new Date(value.start).getDay();
    setValue({ ...value, repeat: on ? { days: [Number.isNaN(startDay) ? 1 : startDay], weeks: DEFAULT_REPEAT_WEEKS } : null });
  };

  const toggleDay = (day: number) => {
    if (!repeat) return;
    const days = repeat.days.includes(day) ? repeat.days.filter((d) => d !== day) : [...repeat.days, day];
    setValue({ ...value, repeat: { ...repeat, days } });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-muted mb-1.5">{t.shiftForm.start}</label>
        <input
          type="datetime-local"
          value={value.start}
          onChange={(e) => setValue({ ...value, start: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-muted mb-1.5">{t.shiftForm.end}</label>
        <input
          type="datetime-local"
          value={value.end}
          min={value.start}
          onChange={(e) => setValue({ ...value, end: e.target.value })}
          className={inputClass}
          required
        />
      </div>

      {!value.id && (
        <div className="rounded-lg border border-[#2a2a2a] p-3 space-y-3">
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={!!repeat}
              onChange={(e) => toggleRepeat(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            <Repeat size={15} className="text-primary" />
            {t.shiftForm.repeat}
          </label>
          {repeat && (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted mr-1">{t.shiftForm.repeatOn}</span>
                {WEEKDAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    aria-pressed={repeat.days.includes(day)}
                    className={cn(
                      'min-w-10 px-2 py-1 rounded-md text-xs font-medium border transition-colors',
                      repeat.days.includes(day)
                        ? 'bg-primary/20 border-primary/50 text-white'
                        : 'border-[#333] text-muted hover:text-white'
                    )}
                  >
                    {weekdayName(day)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{t.shiftForm.repeatFor}</span>
                {/* 0 stands for an empty box while typing; it disables the submit button and becomes 1 on blur. */}
                <input
                  type="number"
                  min={1}
                  max={MAX_REPEAT_WEEKS}
                  value={repeat.weeks || ''}
                  onChange={(e) => {
                    const weeks = Math.min(MAX_REPEAT_WEEKS, Math.max(0, Math.floor(Number(e.target.value) || 0)));
                    setValue({ ...value, repeat: { ...repeat, weeks } });
                  }}
                  onBlur={() => {
                    if (repeat.weeks < 1) setValue({ ...value, repeat: { ...repeat, weeks: 1 } });
                  }}
                  className="w-20 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                />
                <span className="text-xs text-muted">{t.shiftForm.weeksUnit(repeat.weeks)}</span>
              </div>
            </>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm text-muted mb-1.5">{t.shiftForm.note}</label>
        <textarea
          value={value.note}
          onChange={(e) => setValue({ ...value, note: e.target.value })}
          maxLength={500}
          rows={3}
          placeholder={t.shiftForm.notePlaceholder}
          className={inputClass}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">{error}</div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t.common.cancel}
        </Button>
        <Button type="submit" disabled={saving || count === 0}>
          {saving
            ? t.shiftForm.saving
            : value.id
              ? t.shiftForm.save
              : repeat
                ? t.shiftForm.addMany(count)
                : t.shiftForm.add}
        </Button>
      </div>
    </form>
  );
}
