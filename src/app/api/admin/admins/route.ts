import { NextRequest, NextResponse } from 'next/server';
import { adminStore, getAdminSession } from '@/lib/auth';

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

// GET /api/admin/admins — list all admin accounts
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ admins: adminStore.listAdmins(), currentId: session.id });
}

// PATCH /api/admin/admins — update an admin account
// Body: { id, username?, email?, password? }
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, username, email, password } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Admin id is required.' }, { status: 400 });
    }

    if (password && password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const updated = adminStore.update(id, { username, email, password });
    if (!updated) {
      return NextResponse.json(
        { error: 'Admin not found or username/email already taken.' },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, admin: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/admins — remove an admin account
// Body: { id }
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Admin id is required.' }, { status: 400 });
    }

    // Prevent self-deletion
    if (session.id === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account while logged in.' },
        { status: 400 }
      );
    }

    const ok = adminStore.delete(id);
    if (!ok) {
      return NextResponse.json(
        { error: 'Cannot delete: admin not found or this is the last admin account.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
