import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as { role?: string }).role === 'admin';
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

export async function PUT(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { _id, ...data } = await req.json();
  const product = await Product.findByIdAndUpdate(_id, data, { new: true });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = await req.json();
  const product = await Product.findById(id);
  if (product) {
    for (const img of product.images || []) {
      if (img.startsWith('/uploads/')) {
        try {
          await unlink(join(process.cwd(), 'public', img));
        } catch {
          // file may already be deleted
        }
      }
    }
    await Product.findByIdAndDelete(id);
  }
  return NextResponse.json({ success: true });
}
