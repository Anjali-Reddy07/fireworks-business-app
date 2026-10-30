export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { registerCustomer, loginCustomer } from '@/lib/customer-auth';

// POST /api/customer/register
export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, password } = await req.json();

    if (!name || !phone || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const result = await registerCustomer(name.trim(), phone.trim(), email.trim(), password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ success: true, customer: result.customer });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
