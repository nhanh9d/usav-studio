import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shift, { customerOrdersPopulate } from '@/models/Shift';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Product categories whose orders are fulfilled by a booster during a shift.
const SHIFT_CATEGORIES = ['boost', 'coaching'];

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as { role?: string }).role === 'admin';
}

// GET /api/admin/shifts?from=<ISO>&to=<ISO> — every booster's shifts in that range, all boosters (so ones without
// shifts still get a row), and the open orders that can be assigned: boost/coaching purchases and buyers' session
// requests, each marked `assigned` when it already sits in any shift.
export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = new Date(searchParams.get('from') || '');
  const to = new Date(searchParams.get('to') || '');
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return NextResponse.json({ error: 'from and to are required' }, { status: 400 });
  }

  await dbConnect();
  const shiftProductIds = await Product.find({ category: { $in: SHIFT_CATEGORIES } }).distinct('_id');
  const [shifts, openOrders, boosters] = await Promise.all([
    Shift.find({ start: { $lt: to }, end: { $gt: from } })
      .sort({ start: 1 })
      .populate({ path: 'boosterId', model: User, select: 'name avatar discordId' })
      .populate(customerOrdersPopulate)
      .lean(),
    Order.find({
      status: { $in: ['pending', 'processing'] },
      $or: [{ kind: 'session' }, { 'items.productId': { $in: shiftProductIds } }],
    })
      .select(customerOrdersPopulate.select)
      .populate({ path: 'userId', model: User, select: 'name avatar discordId' })
      .sort({ createdAt: 1 })
      .lean(),
    User.find({ role: 'booster' }).select('name avatar').sort({ name: 1 }).lean(),
  ]);

  const assignedIds = new Set(
    (await Shift.distinct('orders', { orders: { $in: openOrders.map((o) => o._id) } })).map(String)
  );
  const withAssigned = openOrders.map((o) => ({ ...o, assigned: assignedIds.has(String(o._id)) }));

  return NextResponse.json({ shifts, openOrders: withAssigned, boosters });
}

// PUT { shiftId, orderId, action: 'assign' | 'unassign' }. An order may sit in several shifts when
// the work spans more than one session.
export async function PUT(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { shiftId, orderId, action } = await req.json();
  if (action !== 'assign' && action !== 'unassign') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
  if (action === 'assign' && !(await Order.exists({ _id: orderId }))) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const update = action === 'assign' ? { $addToSet: { orders: orderId } } : { $pull: { orders: orderId } };
  const shift = await Shift.findByIdAndUpdate(shiftId, update, { new: true })
    .populate({ path: 'boosterId', model: User, select: 'name avatar discordId' })
    .populate(customerOrdersPopulate)
    .lean();
  if (!shift) return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
  return NextResponse.json({ shift });
}
