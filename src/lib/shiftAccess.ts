import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import Shift from '@/models/Shift';
import { MAX_REPEAT_WEEKS, SHIFT_ROLES, validateShiftTimes } from './shifts';
import type { ErrorCode } from './boosterI18n';

// The signed-in user's id when they may manage their own shifts (boosters, and admins for testing).
export async function getBoosterId() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || !SHIFT_ROLES.includes(user.role || '')) return null;
  return user.id;
}

// Reads start/end/note from a request body and rejects invalid or overlapping shifts with an error code.
// Expects an open database connection.
export async function parseShift(
  body: { start?: string; end?: string; note?: string },
  boosterId: string,
  excludeId?: string
): Promise<{ error: ErrorCode; shift?: undefined } | { error?: undefined; shift: { start: Date; end: Date; note: string } }> {
  const start = new Date(body.start || '');
  const end = new Date(body.end || '');
  const error = validateShiftTimes(start, end);
  if (error) return { error };

  const overlap = await Shift.exists({
    boosterId,
    start: { $lt: end },
    end: { $gt: start },
    ...(excludeId && { _id: { $ne: excludeId } }),
  });
  if (overlap) return { error: 'shiftOverlap' };

  return { shift: { start, end, note: (body.note || '').slice(0, 500) } };
}

// A weekly series is at most 7 shifts a week for MAX_REPEAT_WEEKS weeks.
const MAX_SERIES_SHIFTS = 7 * MAX_REPEAT_WEEKS;

// Reads { shifts: [{ start, end }], note } for a new weekly series. Copies that overlap the booster's existing shifts
// (or an earlier copy) are left out and counted in `skipped`; it is an error only when nothing is left.
// Expects an open database connection.
export async function parseShiftSeries(
  body: { shifts?: { start?: string; end?: string }[]; note?: string },
  boosterId: string
): Promise<
  | { error: ErrorCode; shifts?: undefined; skipped?: undefined }
  | { error?: undefined; shifts: { start: Date; end: Date; note: string }[]; skipped: number }
> {
  const items = (Array.isArray(body.shifts) ? body.shifts : []).slice(0, MAX_SERIES_SHIFTS).map((item) => ({
    start: new Date(item?.start || ''),
    end: new Date(item?.end || ''),
  }));
  if (items.length === 0) return { error: 'shiftTimesRequired' };
  for (const { start, end } of items) {
    const error = validateShiftTimes(start, end);
    if (error) return { error };
  }

  items.sort((a, b) => a.start.getTime() - b.start.getTime());
  const existing = await Shift.find({
    boosterId,
    start: { $lt: items[items.length - 1].end },
    end: { $gt: items[0].start },
  })
    .select('start end')
    .lean<{ start: Date; end: Date }[]>();

  const note = (body.note || '').slice(0, 500);
  const kept: { start: Date; end: Date; note: string }[] = [];
  for (const item of items) {
    const overlaps = (s: { start: Date; end: Date }) => s.start < item.end && s.end > item.start;
    if (existing.some(overlaps) || kept.some(overlaps)) continue;
    kept.push({ ...item, note });
  }
  if (kept.length === 0) return { error: 'shiftOverlap' };
  return { shifts: kept, skipped: items.length - kept.length };
}
