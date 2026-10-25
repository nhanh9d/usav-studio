import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';
import { BOOKING_ROLES, validateBooking } from '@/lib/bookings';
import { apiError } from '@/lib/boosterI18n';
import Order from '@/models/Order';

async function getBuyerId() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  return user?.id && BOOKING_ROLES.includes(user.role || '') ? user.id : null;
}

// GET — the signed-in buyer's own session requests, newest first.
export async function GET() {
  const userId = await getBuyerId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const bookings = await Order.find({ userId, kind: 'session' })
    .select('status requestedStart requestedEnd description createdAt')
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ bookings });
}

// POST { start, end, description } — creates a pending session order for admin to assign to a shift.
export async function POST(req: NextRequest) {
  const userId = await getBuyerId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const start = new Date(body.start);
  const end = new Date(body.end);
  const description = typeof body.description === 'string' ? body.description : '';
  const error = validateBooking(start, end, description);
  if (error) return NextResponse.json(apiError(error), { status: 400 });

  await dbConnect();
  const booking = await Order.create({
    userId,
    kind: 'session',
    items: [],
    total: 0,
    requestedStart: start,
    requestedEnd: end,
    description: description.trim(),
  });
  return NextResponse.json({ booking }, { status: 201 });
}
