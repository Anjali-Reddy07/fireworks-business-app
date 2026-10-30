import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { sendAdminEmail, orderEmailHtml } from '@/lib/email';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface OrderRecord {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  festivalDate: string;
  pickupNote?: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pay at Counter' | 'Paid';
  createdAt: string;
}

// In-memory fallback
let inMemoryOrders: OrderRecord[] = [
  {
    id: 'ord-1001',
    orderId: 'ORD-2026-8192',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.s@gmail.com',
    customerPhone: '+91 98450 12345',
    festivalDate: '2026-11-01',
    pickupNote: 'Will collect before 6 PM on festival eve',
    items: [
      { productId: 'prod-001', name: '30cm Royal Golden Sparklers (10 Pcs)', quantity: 3, price: 180 },
      { productId: 'prod-003', name: 'Golden Mega Fountains (Anar Deluxe - 5 Pcs)', quantity: 2, price: 350 },
    ],
    total: 1240,
    status: 'Confirmed',
    paymentStatus: 'Pay at Counter',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-1002',
    orderId: 'ORD-2026-6419',
    customerName: 'Karthik Raja',
    customerEmail: 'karthik.raja@yahoo.com',
    customerPhone: '+91 97890 54321',
    festivalDate: '2026-11-03',
    pickupNote: 'Please keep safe child-friendly items packed separately',
    items: [
      { productId: 'prod-010', name: 'Sampoorna Deepavali Grand Family Box (35 Items)', quantity: 1, price: 2450 },
    ],
    total: 2450,
    status: 'Pending',
    paymentStatus: 'Pay at Counter',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    if (!snapshot.empty) {
      const orders = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as OrderRecord[];
      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json({ orders });
    }
  } catch (err) {
    console.warn('[Firestore GET Orders Warning]:', err);
  }

  return NextResponse.json({ orders: inMemoryOrders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      festivalDate,
      pickupNote,
      items,
      total,
    } = body;

    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Customer name and valid order items are required.' }, { status: 400 });
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-2026-${randomDigits}`;

    const newOrder: OrderRecord = {
      id: orderId,
      orderId,
      customerName: customerName.trim(),
      customerEmail: (customerEmail || 'counter@fireworks.local').trim(),
      customerPhone: (customerPhone || '').trim(),
      festivalDate: festivalDate || '2026-11-01',
      pickupNote: (pickupNote || '').trim(),
      items: items.map((it: any) => ({
        productId: String(it.productId || it.id || 'prod-custom'),
        name: String(it.name || 'Cracker Item'),
        quantity: Number(it.quantity || 1),
        price: Number(it.price || 0),
      })),
      total: Number(total || 0),
      status: 'Pending',
      paymentStatus: 'Pay at Counter',
      createdAt: new Date().toISOString(),
    };

    // Save to Firebase Firestore
    try {
      const sanitized = Object.fromEntries(
        Object.entries(newOrder).filter(([, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'orders', orderId), sanitized);
    } catch (fsErr) {
      console.warn('[Firestore Order Insert Warning]:', fsErr);
    }

    // Also update in-memory
    inMemoryOrders.unshift(newOrder);

    // Send admin email notification
    try {
      const html = orderEmailHtml({
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        items: newOrder.items,
        total: newOrder.total,
      });
      await sendAdminEmail(`New Order ${orderId} - ₹${newOrder.total}`, html);
    } catch (emailErr) {
      console.warn('[Order Email Notification Warning]:', emailErr);
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.orderId,
      order: newOrder,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to process order';
    console.error('Order route error:', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
