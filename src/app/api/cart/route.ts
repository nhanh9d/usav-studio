import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
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
  const cart = await Cart.findOne({ userId }).populate('items.productId').lean();
  return NextResponse.json({ cart: cart || { items: [] } });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const { productId, quantity = 1 } = await req.json();

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [{ productId, quantity }] });
  } else {
    const existingItem = cart.items.find((item: { productId: { toString: () => string } }) => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
  }

  return NextResponse.json({ cart });
}

export async function PUT(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const { productId, quantity } = await req.json();

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

  const item = cart.items.find((item: { productId: { toString: () => string } }) => item.productId.toString() === productId);
  if (item) {
    item.quantity = quantity;
    await cart.save();
  }

  return NextResponse.json({ cart });
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const { productId } = await req.json();

  await Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: { productId } } }
  );

  return NextResponse.json({ success: true });
}
