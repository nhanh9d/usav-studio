'use client';
import { useEffect, useRef, useState } from 'react';
import { Repeat, Users } from 'lucide-react';
import { addDays, formatTime, isSameDay } from '@/lib/shifts';
import { cn } from '@/lib/utils';
import { intlLocale } from '@/lib/boosterI18n';
import { useLocale } from '@/components/booster/LocaleProvider';
import { IShift } from '@/types';

const HOUR_PX = 48;
const HOURS = Array.from({ length: 24 }, (_, h) => h);

interface ShiftCalendarProps {
  weekStart: Date;
  shifts: IShift[];
  onSelect: (shift: IShift) => void;
  // Called with the clicked hour when an empty slot is clicked.
  onCreateAt: (start: Date) => void;
}

export default function ShiftCalendar({ weekStart, shifts, onSelect, onCreateAt }: ShiftCalendarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { locale, t } = useLocale();
  const [now, setNow] = useState(() => new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Open on the working day rather than midnight, with the 08:00 label fully in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 8 * HOUR_PX - HOUR_PX / 2 });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const minutesIntoDay = (date: Date) => date.getHours() * 60 + date.getMinutes();

  return (
    // One scroll box for both directions: the day header sticks to the top and the hour column to the left, so
    // they always line up with the grid (a separate inner scroller let its scrollbar shift the columns).
    <div
      ref={scrollRef}
      className="bg-card rounded-xl border border-[#2a2a2a] overflow-auto h-[calc(100dvh-12rem)] min-h-[420px] max-h-[860px]"
    >
      <div className="min-w-[760px]">
        {/* Day headers */}
        <div className="sticky top-0 z-20 grid grid-cols-[56px_repeat(7,1fr)] border-b border-[#2a2a2a] bg-card">
          <div className="sticky left-0 z-10 bg-card" />
          {days.map((day) => {
            const today = isSameDay(day, now);
            return (
              <div key={day.toISOString()} className="py-3 text-center border-l border-[#2a2a2a]">
                <p className={cn('text-xs uppercase', today ? 'text-primary' : 'text-muted')}>
                  {day.toLocaleDateString(intlLocale[locale], { weekday: 'short' })}
                </p>
                <p
                  className={cn(
                    'mt-0.5 mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                    today ? 'bg-primary text-white' : 'text-white'
                  )}
                >
                  {day.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div>
          <div className="grid grid-cols-[56px_repeat(7,1fr)] relative" style={{ height: 24 * HOUR_PX }}>
            <div className="sticky left-0 z-10 bg-card">
              {HOURS.map((h) => (
                <span
                  key={h}
                  className="absolute right-2 -translate-y-1/2 text-[11px] text-muted"
                  style={{ top: h * HOUR_PX }}
                >
                  {h === 0 ? '' : `${String(h).padStart(2, '0')}:00`}
                </span>
              ))}
            </div>

            {days.map((day) => {
              const dayEnd = addDays(day, 1);
              const daySegments = shifts
                .map((shift) => {
                  const start = new Date(shift.start);
                  const end = new Date(shift.end);
                  // A shift past midnight shows in both days, clipped to each.
                  const segStart = start < day ? day : start;
                  const segEnd = end > dayEnd ? dayEnd : end;
                  return { shift, start, end, segStart, segEnd };
                })
                .filter(({ segStart, segEnd }) => segEnd > segStart);

              return (
                <div
                  key={day.toISOString()}
                  className="relative border-l border-[#2a2a2a] cursor-pointer hover:bg-white/[0.02]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(to bottom, #222 0 1px, transparent 1px ${HOUR_PX}px)`,
                  }}
                  onClick={(e) => {
                    if (e.target !== e.currentTarget) return;
                    const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
                    const start = new Date(day);
                    start.setHours(Math.floor(y / HOUR_PX));
                    onCreateAt(start);
                  }}
                >
                  {daySegments.map(({ shift, start, end, segStart, segEnd }) => {
                    const top = (minutesIntoDay(segStart) / 60) * HOUR_PX;
                    const height = ((segEnd.getTime() - segStart.getTime()) / 3_600_000) * HOUR_PX;
                    const past = end < now;
                    return (
                      <button
                        key={shift._id}
                        onClick={() => onSelect(shift)}
                        className={cn(
                          'absolute left-1 right-1 rounded-md px-2 py-1 text-left overflow-hidden border-l-2 transition-colors',
                          past
                            ? 'bg-[#2a2a2a] border-[#555] text-muted hover:bg-[#333]'
                            : 'bg-primary/20 border-primary text-white hover:bg-primary/30'
                        )}
                        style={{ top, height: Math.max(height, 22) }}
                      >
                        <p className="text-xs font-semibold leading-tight flex items-center gap-1">
                          {formatTime(start, locale)} – {formatTime(end, locale)}
                          {shift.seriesId && <Repeat size={10} className="opacity-70 shrink-0" />}
                        </p>
                        {height >= 40 && (
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] opacity-80">
                            <Users size={11} />
                            {t.common.customers(shift.orders.length)}
                          </p>
                        )}
                        {height >= 64 && shift.note && <p className="mt-0.5 text-[11px] opacity-70 truncate">{shift.note}</p>}
                      </button>
                    );
                  })}

                  {isSameDay(day, now) && (
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-accent pointer-events-none"
                      style={{ top: (minutesIntoDay(now) / 60) * HOUR_PX }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
