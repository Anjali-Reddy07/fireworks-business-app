import { NextRequest, NextResponse } from 'next/server';
import { registerAdmin, adminStore, getAdminSession } from '@/lib/auth';

// GET /api/admin/register — check if any admin exists (for first-run UI)
export async function GET() {
  return NextResponse.json({ hasAdmin: adminStore.hasAnyAdmin() });
}

// POST /api/admin/register
// • If no admin exists yet: open (first-time setup — anyone can call this once)
// • If at least one admin exists: requires a valid admin session (invite flow)
export async function POST(req: NextRequest) {
  try {
    const isFirstSetup = !adminStore.hasAnyAdmin();

    if (!isFirstSetup) {
      // Only a logged-in admin may invite new admins
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized. You must be logged in as an admin to invite new admins.' },
          { status: 401 }
        );
      }
    }

    const { username, email, password, confirmPassword } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const result = await registerAdmin(username.trim(), email.trim(), password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ success: true, admin: result.admin });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
