export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { loginCustomer } from '@/lib/customer-auth';

// POST /api/customer/login
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const result = await loginCustomer(email.trim(), password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ success: true, customer: result.customer });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
