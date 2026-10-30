import { NextRequest, NextResponse } from 'next/server';
import { adminStore, getAdminSession, AdminUser } from '@/lib/auth';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

// GET /api/admin/admins — list all admin accounts from Firebase DB
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const snap = await getDocs(collection(db, 'admins'));
    if (!snap.empty) {
      const admins = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          username: data.username,
          email: data.email,
          role: data.role || 'admin',
          isAdmin: true,
          createdAt: data.createdAt || '',
        };
      }) as AdminUser[];
      return NextResponse.json({ admins, currentId: session.id });
    }
  } catch (err) {
    console.warn('[Firestore GET Admins Warning]:', err);
  }

  return NextResponse.json({ admins: adminStore.listAdmins(), currentId: session.id });
}

// PATCH /api/admin/admins — update an admin account
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

    const updates: Record<string, any> = {};
    if (username) updates.username = username.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (password) {
      updates.passwordHash = Buffer.from(password + ':fireworks_admin_salt_v2').toString('base64');
    }

    try {
      await updateDoc(doc(db, 'admins', id), updates);
      await updateDoc(doc(db, 'users', id), {
        ...(username ? { username: username.trim(), name: `${username.trim()} (Admin)` } : {}),
        ...(email ? { email: email.trim().toLowerCase() } : {}),
      });
    } catch (fsErr) {
      console.warn('[Firestore Update Admin Warning]:', fsErr);
    }

    const updated = adminStore.update(id, { username, email, password });

    return NextResponse.json({ success: true, admin: updated || { id, ...updates } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/admins — remove an admin account
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

    try {
      await deleteDoc(doc(db, 'admins', id));
      await deleteDoc(doc(db, 'users', id));
    } catch (fsErr) {
      console.warn('[Firestore Delete Admin Warning]:', fsErr);
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
