// Session bookings: buyers request a time slot with a description; admin assigns it to a booster's shift.

import { HOUR_MS } from './shifts';
import type { ErrorCode } from './boosterI18n';

// Admins can book too, so they can try the flow.
export const BOOKING_ROLES = ['buyer', 'admin'];
export const MAX_BOOKING_HOURS = 12;
export const MIN_DESCRIPTION = 10;
export const MAX_DESCRIPTION = 1000;

// Returns an error code (translated in src/lib/boosterI18n.ts), or null when the request is valid.
export function validateBooking(start: Date, end: Date, description: string, now = new Date()): ErrorCode | null {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'invalidTimes';
  if (start <= now) return 'pastStart';
  if (end <= start) return 'endBeforeStart';
  if (end.getTime() - start.getTime() > MAX_BOOKING_HOURS * HOUR_MS) return 'bookingTooLong';
  const text = description.trim();
  if (text.length < MIN_DESCRIPTION) return 'descriptionShort';
  if (text.length > MAX_DESCRIPTION) return 'descriptionLong';
  return null;
}
