export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { OrderRecord } from '@/app/api/orders/route';

// GET all orders for admin
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    if (!snapshot.empty) {
      const orders = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as OrderRecord[];
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json({ orders });
    }
  } catch (err) {
    console.warn('[Firestore GET Admin Orders Warning]:', err);
  }

  // Fallback to calling /api/orders GET
  const fallback = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/orders`, {
    cache: 'no-store',
  }).then((r) => r.json()).catch(() => ({ orders: [] }));

  return NextResponse.json({ orders: fallback.orders || [] });
}

// PATCH update status of an order
export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id, status, paymentStatus } = await req.json();

    if (!id || (!status && !paymentStatus)) {
      return NextResponse.json({ error: 'Order ID and updated status are required.' }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    updates.updatedAt = new Date().toISOString();

    // Update in Firebase Firestore
    try {
      await updateDoc(doc(db, 'orders', id), updates);
    } catch {
      // If doc doesn't exist, try set with merge
      await setDoc(doc(db, 'orders', id), updates, { merge: true });
    }

    return NextResponse.json({ success: true, id, updates });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating order status';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

