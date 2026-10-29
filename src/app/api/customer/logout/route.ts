import { NextResponse } from 'next/server';
import { logoutCustomer } from '@/lib/customer-auth';

// POST /api/customer/logout
export async function POST() {
  await logoutCustomer();
  return NextResponse.json({ success: true });
}
