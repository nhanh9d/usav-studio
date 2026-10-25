import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as { role?: string }).role === 'admin';
}

async function getOrdersByCategory() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const pipeline = [
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          category: { $ifNull: ['$product.category', 'unknown'] },
        },
        count: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { '_id.date': -1 as const } },
  ];

  const results = await Order.aggregate(pipeline);

  // Pivot into { date, categories: { [cat]: { count, revenue } }, total }
  const byDate: Record<string, { categories: Record<string, { count: number; revenue: number }>; totalCount: number; totalRevenue: number }> = {};
  const allCategories = new Set<string>();

  for (const r of results) {
    const { date, category } = r._id;
    allCategories.add(category);
    if (!byDate[date]) {
      byDate[date] = { categories: {}, totalCount: 0, totalRevenue: 0 };
    }
    byDate[date].categories[category] = { count: r.count, revenue: r.revenue };
    byDate[date].totalCount += r.count;
    byDate[date].totalRevenue += r.revenue;
  }

  const daily = Object.entries(byDate)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalOrders = daily.reduce((s, d) => s + d.totalCount, 0);
  const totalRevenue = daily.reduce((s, d) => s + d.totalRevenue, 0);

  // Find top category
  const catTotals: Record<string, number> = {};
  for (const d of daily) {
    for (const [cat, val] of Object.entries(d.categories)) {
      catTotals[cat] = (catTotals[cat] || 0) + val.revenue;
    }
  }
  const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return { daily, categories: Array.from(allCategories).sort(), totalOrders, totalRevenue, topCategory };
}

async function getSoldAccounts() {
  const pipeline = [
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    { $match: { 'product.category': 'accounts' } },
    {
      $group: {
        _id: '$status',
        count: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
  ];

  const results = await Order.aggregate(pipeline);
  const totalAccountProducts = await Product.countDocuments({ category: 'accounts' });

  const statusBreakdown: Record<string, { count: number; revenue: number }> = {};
  let totalSold = 0;

  for (const r of results) {
    statusBreakdown[r._id] = { count: r.count, revenue: r.revenue };
    totalSold += r.count;
  }

  return { statusBreakdown, totalSold, totalAccountProducts };
}

async function getPurchaseHistory(page: number, limit: number, status?: string) {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name email')
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'orders-by-category':
        return NextResponse.json(await getOrdersByCategory());

      case 'sold-accounts':
        return NextResponse.json(await getSoldAccounts());

      case 'purchase-history': {
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
        const status = searchParams.get('status') || undefined;
        return NextResponse.json(await getPurchaseHistory(page, limit, status));
      }

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
