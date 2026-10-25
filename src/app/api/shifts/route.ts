import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Shift, { customerOrdersPopulate } from '@/models/Shift';
import { getBoosterId, parseShift, parseShiftSeries } from '@/lib/shiftAccess';
import { apiError } from '@/lib/boosterI18n';

// GET /api/shifts?from=<ISO>&to=<ISO> — the signed-in booster's shifts in that range.
export async function GET(req: NextRequest) {
  const boosterId = await getBoosterId();
  if (!boosterId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = new Date(searchParams.get('from') || '');
  const to = new Date(searchParams.get('to') || '');
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return NextResponse.json({ error: 'from and to are required' }, { status: 400 });
  }

  await dbConnect();
  const shifts = await Shift.find({ boosterId, start: { $lt: to }, end: { $gt: from } })
    .sort({ start: 1 })
    .populate(customerOrdersPopulate)
    .lean();
  return NextResponse.json({ shifts });
}

// POST { start, end, note } creates one shift. POST { shifts: [{ start, end }], note } creates a weekly series,
// leaving out copies that overlap existing shifts; the response says how many were skipped.
export async function POST(req: NextRequest) {
  const boosterId = await getBoosterId();
  if (!boosterId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await req.json().catch(() => ({}));
  if (Array.isArray(body.shifts)) {
    const result = await parseShiftSeries(body, boosterId);
    if (result.error) return NextResponse.json(apiError(result.error), { status: 400 });
    const seriesId = result.shifts.length > 1 ? new Types.ObjectId() : undefined;
    const shifts = await Shift.insertMany(result.shifts.map((s) => ({ boosterId, seriesId, ...s })));
    return NextResponse.json({ shifts, skipped: result.skipped }, { status: 201 });
  }

  const result = await parseShift(body, boosterId);
  if (result.error) return NextResponse.json(apiError(result.error), { status: 400 });

  const shift = await Shift.create({ boosterId, ...result.shift });
  return NextResponse.json({ shift }, { status: 201 });
}
