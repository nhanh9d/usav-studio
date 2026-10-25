import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';
import Order from '@/models/Order';
import Shift from '@/models/Shift';
import User from '@/models/User';

const STATUSES = ['pending', 'processing', 'completed', 'cancelled'];

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as { role?: string }).role === 'admin';
}

// GET ?status=<status>&kind=<purchase|session> — orders with their customer and the shifts they are assigned to.
// Account credentials on purchased items are never included.
export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filter: Record<string, unknown> = {};
  const status = searchParams.get('status');
  if (status && STATUSES.includes(status)) filter.status = status;
  const kind = searchParams.get('kind');
  // Orders created before bookings existed have no kind and are purchases.
  if (kind === 'session') filter.kind = 'session';
  if (kind === 'purchase') filter.kind = { $ne: 'session' };

  await dbConnect();
  const orders = await Order.find(filter)
    .select('-items.accountLogin -items.accountPassword')
    .populate({ path: 'userId', model: User, select: 'name avatar discordId' })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const shifts = await Shift.find({ orders: { $in: orders.map((o) => o._id) } })
    .select('start end orders boosterId')
    .populate({ path: 'boosterId', model: User, select: 'name' })
    .lean();

  // Shifts overlapping an open session request's time, for assigning it in one click.
  const open = orders.filter(
    (o) => o.kind === 'session' && ['pending', 'processing'].includes(o.status) && o.requestedStart && o.requestedEnd
  );
  const overlapping = open.length
    ? await Shift.find({ $or: open.map((o) => ({ start: { $lt: o.requestedEnd }, end: { $gt: o.requestedStart } })) })
        .select('start end orders boosterId')
        .populate({ path: 'boosterId', model: User, select: 'name' })
        .lean()
    : [];

  const boosterName = (s: { boosterId?: unknown }) => (s.boosterId as { name?: string } | null)?.name || 'Unknown booster';
  const holds = (s: { orders: { toString(): string }[] }, orderId: string) => s.orders.some((id) => id.toString() === orderId);

  const withShifts = orders.map((order) => {
    const orderId = order._id.toString();
    const result = {
      ...order,
      shifts: shifts
        .filter((s) => holds(s, orderId))
        .map((s) => ({ _id: s._id, start: s.start, end: s.end, booster: boosterName(s) })),
    };
    if (!open.includes(order)) return result;

    const { requestedStart: from, requestedEnd: to } = order as { requestedStart: Date; requestedEnd: Date };
    const candidates = overlapping
      .filter((s) => s.start < to && s.end > from && !holds(s, orderId))
      .map((s) => ({
        _id: s._id,
        start: s.start,
        end: s.end,
        booster: boosterName(s),
        customers: s.orders.length,
        covers: s.start <= from && s.end >= to,
      }))
      // Shifts covering the whole request first, then the least busy.
      .sort((a, b) => Number(b.covers) - Number(a.covers) || a.customers - b.customers);
    return { ...result, candidates };
  });

  return NextResponse.json({ orders: withShifts });
}

// PUT { orderId, status } — moves an order through pending → processing → completed, or cancels it.
export async function PUT(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderId, status } = await req.json().catch(() => ({}));
  if (!STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

  await dbConnect();
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).select('status').lean();
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ order });
}
