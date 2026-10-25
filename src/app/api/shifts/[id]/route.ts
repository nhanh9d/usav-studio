import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shift, { customerOrdersPopulate } from '@/models/Shift';
import { getBoosterId, parseShift } from '@/lib/shiftAccess';
import { apiError } from '@/lib/boosterI18n';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const boosterId = await getBoosterId();
  if (!boosterId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const { id } = await params;
  const result = await parseShift(await req.json(), boosterId, id);
  if (result.error) return NextResponse.json(apiError(result.error), { status: 400 });

  // Matching on boosterId too means a booster can only edit their own shifts.
  const shift = await Shift.findOneAndUpdate({ _id: id, boosterId }, result.shift, { new: true })
    .populate(customerOrdersPopulate)
    .lean();
  if (!shift) return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
  return NextResponse.json({ shift });
}

// DELETE removes one shift. DELETE ?scope=following removes it and the later shifts of its weekly series; shifts
// with customers are kept and counted in `kept`.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const boosterId = await getBoosterId();
  if (!boosterId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const { id } = await params;
  const shift = await Shift.findOne({ _id: id, boosterId });
  if (!shift) return NextResponse.json({ error: 'Shift not found' }, { status: 404 });

  if (req.nextUrl.searchParams.get('scope') === 'following' && shift.seriesId) {
    const series = await Shift.find({ boosterId, seriesId: shift.seriesId, start: { $gte: shift.start } })
      .select('orders')
      .lean<{ _id: unknown; orders: unknown[] }[]>();
    const free = series.filter((s) => s.orders.length === 0).map((s) => s._id);
    if (free.length === 0) return NextResponse.json(apiError('shiftHasCustomers'), { status: 409 });
    await Shift.deleteMany({ _id: { $in: free } });
    return NextResponse.json({ success: true, deleted: free.length, kept: series.length - free.length });
  }

  // Deleting would silently drop these customers; an admin has to move them first.
  if (shift.orders.length > 0) {
    return NextResponse.json(apiError('shiftHasCustomers'), { status: 409 });
  }

  await shift.deleteOne();
  return NextResponse.json({ success: true });
}
