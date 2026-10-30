export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const success = await loginAdmin(username, password);

    if (!success) {
      return NextResponse.json({ error: 'Invalid administrator credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'Authenticated successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
