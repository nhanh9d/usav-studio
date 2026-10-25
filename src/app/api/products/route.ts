import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search');
  const server = searchParams.get('server');

  const filter: Record<string, unknown> = { status: 'active' };
  if (category && category !== 'all') filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (server) filter.server = server;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const products = await Product.find(filter)
    .select('-cost -accountLogin -accountPassword')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json({ product }, { status: 201 });
}
