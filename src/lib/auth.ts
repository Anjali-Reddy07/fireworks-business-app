import { cookies } from 'next/headers';
import { collection, doc, getDoc, getDocs, setDoc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ADMIN_COOKIE_NAME = 'fireworks_admin_session';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role?: string;
  isAdmin?: boolean;
  createdAt: string;
}

function hashPassword(password: string): string {
  return Buffer.from(password + ':fireworks_admin_salt_v2').toString('base64');
}

// ─── In-Memory Admin Account Store (Fallback) ──────────────────────────────

class AdminStore {
  private admins: (AdminUser & { passwordHash: string })[] = [
    {
      id: 'admin-master',
      username: 'admin',
      email: 'admin@sparklersandsmiles.com',
      role: 'admin',
      isAdmin: true,
      passwordHash: hashPassword('password123'),
      createdAt: new Date().toISOString(),
    },
  ];

  findByUsername(username: string) {
    return this.admins.find(
      (a) => a.username.toLowerCase() === username.toLowerCase()
    );
  }

  findByEmail(email: string) {
    return this.admins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
  }

  findById(id: string) {
    return this.admins.find((a) => a.id === id);
  }

  hasAnyAdmin(): boolean {
    return this.admins.length > 0;
  }

  listAdmins(): AdminUser[] {
    return this.admins.map(({ passwordHash: _, ...safe }) => safe);
  }

  register(
    username: string,
    email: string,
    password: string
  ): AdminUser | null {
    if (this.findByUsername(username) || this.findByEmail(email)) return null;
    const newAdmin = {
      id: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      username: username.trim(),
      email: email.toLowerCase().trim(),
      role: 'admin',
      isAdmin: true,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    this.admins.push(newAdmin);
    const { passwordHash: _, ...safe } = newAdmin;
    return safe;
  }

  update(
    id: string,
    fields: { username?: string; email?: string; password?: string }
  ): AdminUser | null {
    const idx = this.admins.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const admin = this.admins[idx];
    if (fields.username) admin.username = fields.username.trim();
    if (fields.email) admin.email = fields.email.toLowerCase().trim();
    if (fields.password) admin.passwordHash = hashPassword(fields.password);

    const { passwordHash: _, ...safe } = admin;
    return safe;
  }

  delete(id: string): boolean {
    if (this.admins.length <= 1) return false;
    const idx = this.admins.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.admins.splice(idx, 1);
    return true;
  }

  verifyPassword(username: string, password: string): AdminUser | null {
    const admin = this.findByUsername(username);
    if (!admin) return null;
    if (admin.passwordHash !== hashPassword(password)) return null;
    const { passwordHash: _, ...safe } = admin;
    return safe;
  }
}

// Persist across HMR hot-reloads in dev
const globalForAdmin = global as unknown as { adminStore?: AdminStore };
const adminStore = globalForAdmin.adminStore ?? new AdminStore();
if (process.env.NODE_ENV !== 'production') globalForAdmin.adminStore = adminStore;

export { adminStore };

// ─── Session Token ──────────────────────────────────────────────────────────

function generateSessionToken(admin: AdminUser): string {
  const payload = JSON.stringify({
    id: admin.id,
    user: admin.username,
    email: admin.email,
    role: 'administrator',
    isAdmin: true,
    issuedAt: Date.now(),
  });
  return Buffer.from(payload).toString('base64');
}

export function parseSessionToken(
  token: string
): { user: string; role: string; id?: string; email?: string } | null {
  try {
    const json = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(json);
    if (data?.role === 'administrator') return data;
    return null;
  } catch {
    return null;
  }
}

// ─── Session Helpers ────────────────────────────────────────────────────────

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return parseSessionToken(token);
}

/**
 * Register a new Admin in Firebase DB `admins` & `users` collections
 */
export async function registerAdmin(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; admin?: AdminUser }> {
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const pwdHash = hashPassword(password);
  const adminId = `admin-${Date.now()}`;

  // 1. Check Firebase Firestore for existing admin
  try {
    const q1 = query(collection(db, 'admins'), where('username', '==', normalizedUsername));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      return { success: false, error: 'An administrator with that username already exists.' };
    }
  } catch (fsErr) {
    console.warn('[Firestore Admin Check Warning]:', fsErr);
  }

  const newAdminRecord: AdminUser & { passwordHash: string; admin: boolean } = {
    id: adminId,
    username: normalizedUsername,
    email: normalizedEmail,
    role: 'admin',
    admin: true,
    isAdmin: true,
    passwordHash: pwdHash,
    createdAt: new Date().toISOString(),
  };

  // 2. Save directly to Firebase DB `admins` collection
  try {
    await setDoc(doc(db, 'admins', adminId), newAdminRecord);
    console.log(`✅ Admin ${normalizedUsername} saved to Firebase DB 'admins' collection!`);
  } catch (err) {
    console.error('Failed to save admin to Firebase DB:', err);
  }

  // 3. Also save to Firebase DB `users` collection with role: 'admin' and isAdmin: true
  try {
    await setDoc(doc(db, 'users', adminId), {
      id: adminId,
      name: `${normalizedUsername} (Store Admin)`,
      username: normalizedUsername,
      email: normalizedEmail,
      phone: '+91 6371512551',
      role: 'admin',
      admin: true,
      isAdmin: true,
      createdAt: newAdminRecord.createdAt,
    });
    console.log(`✅ Admin also saved to Firebase DB 'users' collection with role: admin!`);
  } catch (err) {
    console.warn('[Firestore User Table Admin Insert]:', err);
  }

  // 4. Update memory store
  adminStore.register(normalizedUsername, normalizedEmail, password);

  const safeAdmin: AdminUser = {
    id: adminId,
    username: normalizedUsername,
    email: normalizedEmail,
    role: 'admin',
    isAdmin: true,
    createdAt: newAdminRecord.createdAt,
  };

  const token = generateSessionToken(safeAdmin);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true, admin: safeAdmin };
}

/**
 * Log in Admin with Firebase DB check
 */
export async function loginAdmin(
  username: string,
  password: string
): Promise<boolean> {
  const normalizedUsername = username.trim();
  const inputHash = hashPassword(password);
  let matchedAdmin: AdminUser | null = null;

  // 1. Verify in Firebase DB `admins` collection first
  try {
    const q = query(collection(db, 'admins'), where('username', '==', normalizedUsername));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0].data();
      if (docData.passwordHash === inputHash) {
        matchedAdmin = {
          id: snap.docs[0].id,
          username: docData.username,
          email: docData.email,
          role: 'admin',
          isAdmin: true,
          createdAt: docData.createdAt || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('[Firestore Admin Login Query Warning]:', err);
  }

  // 2. Fallback to in-memory store if Firestore offline or not found
  if (!matchedAdmin) {
    matchedAdmin = adminStore.verifyPassword(normalizedUsername, password);
  }

  if (!matchedAdmin) return false;

  const token = generateSessionToken(matchedAdmin);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
