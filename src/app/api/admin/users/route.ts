import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CustomerUserDTO {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  admin?: boolean;
  isAdmin?: boolean;
  createdAt: string;
}

const SAMPLE_USERS: CustomerUserDTO[] = [
  {
    id: 'admin-master',
    name: 'System Administrator',
    phone: '+91 6371512551',
    email: 'admin@sparklersandsmiles.com',
    role: 'admin',
    admin: true,
    isAdmin: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cust-demo-1',
    name: 'Ananya Sharma',
    phone: '+91 98450 12345',
    email: 'ananya.s@gmail.com',
    role: 'customer',
    admin: false,
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'cust-demo-2',
    name: 'Karthik Raja',
    phone: '+91 97890 54321',
    email: 'karthik.raja@yahoo.co.in',
    role: 'customer',
    admin: false,
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const snap = await getDocs(collection(db, 'users'));
    if (!snap.empty) {
      const users: CustomerUserDTO[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        const isAdminUser = Boolean(d.admin || d.isAdmin || d.role === 'admin' || docSnap.id.startsWith('admin'));
        return {
          id: docSnap.id,
          name: d.name || (isAdminUser ? 'Admin User' : 'Anonymous Customer'),
          phone: d.phone || '',
          email: d.email || '',
          role: d.role || (isAdminUser ? 'admin' : 'customer'),
          admin: isAdminUser,
          isAdmin: isAdminUser,
          createdAt: d.createdAt || new Date().toISOString(),
        };
      });

      users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json({ users, total: users.length });
    }
  } catch (err) {
    console.warn('[Firestore Users Query Warning]:', err);
  }

  // Fallback to sample users
  return NextResponse.json({ users: SAMPLE_USERS, total: SAMPLE_USERS.length });
}

