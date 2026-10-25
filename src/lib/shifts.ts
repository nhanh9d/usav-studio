// Date helpers for booster shifts, shared by the calendar UI and the shift APIs.

import type { Locale } from '@/content/site';
import type { ErrorCode } from './boosterI18n';

export const SHIFT_ROLES = ['booster', 'admin'];
export const MAX_SHIFT_HOURS = 24;
export const HOUR_MS = 60 * 60 * 1000;

// Weeks start on Monday, in the viewer's local time.
export function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

// Value for an <input type="datetime-local">, which works in local time without a zone.
export function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatTime(date: Date | string, locale: Locale = 'en') {
  return new Date(date).toLocaleTimeString(locale === 'vi' ? 'vi-VN' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatDay(date: Date | string, locale: Locale = 'en') {
  return new Date(date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Returns an error code (translated in src/lib/boosterI18n.ts), or null when the times make a valid shift.
export function validateShiftTimes(start: Date, end: Date): ErrorCode | null {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'shiftTimesRequired';
  if (end <= start) return 'shiftEndBeforeStart';
  if (end.getTime() - start.getTime() > MAX_SHIFT_HOURS * HOUR_MS) return 'shiftTooLong';
  return null;
}

export const MAX_REPEAT_WEEKS = 12;

// Copies of a shift on the given weekdays (0 = Sunday, as Date.getDay) for `weeks` weeks from the week of `start`,
// at the same local time of day and length. Days before `start` are skipped, so the first copy is `start` itself
// when its weekday is picked. Runs in the browser, so "local" is the booster's own time zone.
export function repeatWeekly(start: Date, end: Date, days: number[], weeks: number) {
  const length = end.getTime() - start.getTime();
  const firstWeek = startOfWeek(start);
  const copies: { start: Date; end: Date }[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const s = addDays(firstWeek, i);
    if (!days.includes(s.getDay())) continue;
    s.setHours(start.getHours(), start.getMinutes(), 0, 0);
    if (s < start) continue;
    copies.push({ start: s, end: new Date(s.getTime() + length) });
  }
  return copies;
}
