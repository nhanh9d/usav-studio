import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as { id?: string }).id;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const { paymentMethod = 'bank_transfer' } = await req.json();

  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const items = cart.items.map((item: { productId: { _id: { toString: () => string }; title: string; price: number; category?: string; accountLogin?: string; accountPassword?: string }; quantity: number }) => {
    const orderItem: { productId: unknown; title: string; price: number; quantity: number; accountLogin?: string; accountPassword?: string } = {
      productId: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      quantity: item.quantity,
    };
    if (item.productId.category === 'accounts') {
      if (item.productId.accountLogin) orderItem.accountLogin = item.productId.accountLogin;
      if (item.productId.accountPassword) orderItem.accountPassword = item.productId.accountPassword;
    }
    return orderItem;
  });

  const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    userId,
    items,
    total,
    paymentMethod,
  });

  // Update product stock/sold counts
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.productId._id, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }

  // Clear cart
  await Cart.findOneAndUpdate({ userId }, { items: [] });

  return NextResponse.json({ order }, { status: 201 });
}
