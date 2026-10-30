export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';

export async function GET() {
  try {
    const customer = await getCustomerSession();
    if (!customer) {
      return NextResponse.json({ customer: null }, { status: 200 });
    }
    return NextResponse.json({ customer }, { status: 200 });
  } catch {
    return NextResponse.json({ customer: null }, { status: 200 });
  }
}

