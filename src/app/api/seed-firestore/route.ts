import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { INITIAL_PRODUCTS } from '@/lib/data/sample-products';

export async function GET() {
  try {
    const results: Record<string, number> = {};

    // 1. Seed Products / Fireworks
    let prodCount = 0;
    for (const prod of INITIAL_PRODUCTS) {
      const sanitized = Object.fromEntries(
        Object.entries(prod).filter(([, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'fireworks', prod.id), sanitized);
      prodCount++;
    }
    results.fireworks = prodCount;

    // 2. Seed Inquiries
    const sampleInquiries = [
      {
        id: 'inq-sample-1',
        refId: 'INQ-2026-9481',
        customerName: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        email: 'rajesh.k@gmail.com',
        festivalDate: '2026-11-02',
        requirementType: 'Diwali Festive Family Pack',
        notes: 'Looking for child-safe green sparklers and family assortment box.',
        status: 'Contacted',
        createdAt: '2026-10-25T14:30:00Z',
      },
      {
        id: 'inq-sample-2',
        refId: 'INQ-2026-3829',
        customerName: 'Meenakshi Sundaram',
        phone: '+91 94431 87654',
        email: 'meenakshi.s@gmail.com',
        festivalDate: '2026-11-05',
        requirementType: 'Wedding & Celebration Special',
        notes: 'Require 12-shot aerial repeater cakes and golden anars for wedding celebration.',
        status: 'Pending',
        createdAt: '2026-10-27T09:15:00Z',
      },
      {
        id: 'inq-sample-3',
        refId: 'INQ-2026-5120',
        customerName: 'Suresh Raina',
        phone: '+91 99887 66554',
        email: 'suresh.r@outlook.com',
        festivalDate: '2026-11-01',
        requirementType: 'Custom Cracker Selection',
        notes: 'Assorted chakkars, sparklers, and flowerpots quotation requested.',
        status: 'Quote Sent',
        createdAt: new Date().toISOString(),
      },
    ];

    let inqCount = 0;
    for (const inq of sampleInquiries) {
      await setDoc(doc(db, 'inquiries', inq.id), inq);
      inqCount++;
    }
    results.inquiries = inqCount;

    // 3. Seed Orders
    const sampleOrders = [
      {
        id: 'ORD-2026-8192',
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
        id: 'ORD-2026-6419',
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
      {
        id: 'ORD-2026-9241',
        orderId: 'ORD-2026-9241',
        customerName: 'Vigneshwaran P',
        customerEmail: 'vignesh.p@gmail.com',
        customerPhone: '+91 91234 56789',
        festivalDate: '2026-11-02',
        pickupNote: 'Corporate celebration gift hamper',
        items: [
          { productId: 'prod-011', name: 'Mega VIP Corporate Festive Hamper (55 Premium Items)', quantity: 1, price: 4800 },
        ],
        total: 4800,
        status: 'Dispatched',
        paymentStatus: 'Paid',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ];

    let orderCount = 0;
    for (const ord of sampleOrders) {
      await setDoc(doc(db, 'orders', ord.id), ord);
      orderCount++;
    }
    results.orders = orderCount;

    // 4. Seed Users (Customers)
    const sampleUsers = [
      {
        id: 'cust-demo-1',
        name: 'Ananya Sharma',
        phone: '+91 98450 12345',
        email: 'ananya.s@gmail.com',
        passwordHash: Buffer.from('password123:fireworks_salt_2026').toString('base64'),
        role: 'customer',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: 'cust-demo-2',
        name: 'Karthik Raja',
        phone: '+91 97890 54321',
        email: 'karthik.raja@yahoo.com',
        passwordHash: Buffer.from('password123:fireworks_salt_2026').toString('base64'),
        role: 'customer',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ];

    let userCount = 0;
    for (const usr of sampleUsers) {
      await setDoc(doc(db, 'users', usr.id), usr);
      userCount++;
    }
    results.users = userCount;

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded all e-commerce tables into Firebase Firestore!',
      collections: results,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error seeding Firestore';
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
