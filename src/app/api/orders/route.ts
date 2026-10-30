export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { 
  sendAdminEmail, 
  sendCustomerEmail, 
  orderEmailHtml, 
  customerOrderConfirmationEmailHtml 
} from '@/lib/email';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
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
  admin?: string;
  adminStatus?: string;
  adminAssigned?: string;
  adminNotes?: string;
  isAdminApproved?: boolean;
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
      orderId: clientOrderId,
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
    const orderId = clientOrderId || `ORD-2026-${randomDigits}`;

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

    // 1. Save to Firebase Firestore `orders` collection
    try {
      const sanitized = {
        id: orderId,
        orderId,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: newOrder.customerPhone,
        festivalDate: newOrder.festivalDate,
        pickupNote: newOrder.pickupNote || '',
        items: newOrder.items,
        total: newOrder.total,
        status: newOrder.status,
        paymentStatus: newOrder.paymentStatus,
        createdAt: newOrder.createdAt,
        // Admin column and review tracking
        admin: 'Store Administrator',
        adminStatus: 'Pending Review',
        adminAssigned: 'Admin Desk',
        adminNotes: '',
        isAdminApproved: false,
      };
      await setDoc(doc(db, 'orders', orderId), sanitized, { merge: true });
      console.log(`✅ Order ${orderId} successfully registered into Firebase DB!`);

      // 1b. Auto-register or update customer in Firebase Firestore `users` collection
      if (newOrder.customerEmail && !newOrder.customerEmail.includes('fireworks.local')) {
        try {
          const normalizedEmail = newOrder.customerEmail.toLowerCase().trim();
          const custDocId = `cust-${normalizedEmail.replace(/[^a-z0-9]/g, '_')}`;
          await setDoc(
            doc(db, 'users', custDocId),
            {
              id: custDocId,
              name: newOrder.customerName,
              email: normalizedEmail,
              phone: newOrder.customerPhone || '',
              role: 'customer',
              admin: false,
              isAdmin: false,
              createdAt: newOrder.createdAt,
              lastOrderId: orderId,
              lastOrderTotal: newOrder.total,
            },
            { merge: true }
          );
          console.log(`✅ Customer ${newOrder.customerName} (${normalizedEmail}) auto-saved into Firebase 'users' collection!`);
        } catch (custErr) {
          console.warn('[Firestore Customer Upsert Warning]:', custErr);
        }
      }
    } catch (fsErr) {
      console.error('[Firestore Order/User Insert Error]:', fsErr);
    }

    // 2. Also keep in memory array for instantaneous local fallback
    inMemoryOrders = [newOrder, ...inMemoryOrders.filter((o) => o.orderId !== orderId)];

    // 3. Send Notification & Confirmation Emails Concurrently
    let adminEmailSent = false;
    let customerEmailSent = false;

    const emailTasks: Promise<void>[] = [];

    // Admin order notification email
    const adminHtml = orderEmailHtml({
      orderId: newOrder.orderId,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      customerPhone: newOrder.customerPhone,
      festivalDate: newOrder.festivalDate,
      pickupNote: newOrder.pickupNote,
      items: newOrder.items,
      total: newOrder.total,
    });

    emailTasks.push(
      sendAdminEmail(`🚨 New Order ${orderId} - ₹${newOrder.total} (${newOrder.customerName})`, adminHtml)
        .then((ok) => {
          adminEmailSent = ok;
          if (ok) console.log(`[Order API] Admin notification email sent for ${orderId}`);
        })
        .catch((err) => console.error('[Order API Admin Email Error]:', err))
    );

    // Customer order confirmation email
    if (newOrder.customerEmail && newOrder.customerEmail.includes('@') && !newOrder.customerEmail.includes('fireworks.local')) {
      const customerHtml = customerOrderConfirmationEmailHtml({
        orderId: newOrder.orderId,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: newOrder.customerPhone,
        festivalDate: newOrder.festivalDate,
        pickupNote: newOrder.pickupNote,
        items: newOrder.items,
        total: newOrder.total,
      });

      emailTasks.push(
        sendCustomerEmail(
          newOrder.customerEmail,
          `✨ Festive Order Booking Confirmation [${orderId}] - Sparklers & Smiles`,
          customerHtml
        )
          .then((ok) => {
            customerEmailSent = ok;
            if (ok) console.log(`[Order API] Customer confirmation email sent to ${newOrder.customerEmail} for ${orderId}`);
          })
          .catch((err) => console.error('[Order API Customer Email Error]:', err))
      );
    }

    // Wait for email dispatches to settle
    await Promise.allSettled(emailTasks);

    return NextResponse.json({
      success: true,
      orderId: newOrder.orderId,
      order: newOrder,
      adminEmailSent,
      customerEmailSent,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to process order';
    console.error('Order route error:', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
