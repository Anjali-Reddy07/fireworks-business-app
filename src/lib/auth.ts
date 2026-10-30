import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'fireworks_admin_session';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// ─── In-Memory Admin Account Store ─────────────────────────────────────────

class AdminStore {
  private admins: (AdminUser & { passwordHash: string })[] = [
    {
      id: 'admin-master',
      username: 'admin',
      email: 'admin@sparklersandsmiles.com',
      passwordHash: Buffer.from('password123:fireworks_admin_salt_v2').toString('base64'),
      createdAt: new Date().toISOString(),
    },
  ];

  private hashPassword(password: string): string {
    return Buffer.from(password + ':fireworks_admin_salt_v2').toString('base64');
  }

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

  /** First-time setup OR invite a new admin by an existing admin. */
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
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    this.admins.push(newAdmin);
    const { passwordHash: _, ...safe } = newAdmin;
    return safe;
  }

  /** Update username / email (skip field if undefined). */
  update(
    id: string,
    fields: { username?: string; email?: string; password?: string }
  ): AdminUser | null {
    const idx = this.admins.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const admin = this.admins[idx];

    if (fields.username) {
      const conflict = this.findByUsername(fields.username);
      if (conflict && conflict.id !== id) return null; // username taken
      admin.username = fields.username.trim();
    }
    if (fields.email) {
      const conflict = this.findByEmail(fields.email);
      if (conflict && conflict.id !== id) return null; // email taken
      admin.email = fields.email.toLowerCase().trim();
    }
    if (fields.password) {
      admin.passwordHash = this.hashPassword(fields.password);
    }

    const { passwordHash: _, ...safe } = admin;
    return safe;
  }

  /** Delete an admin by id. Returns false if last admin or not found. */
  delete(id: string): boolean {
    if (this.admins.length <= 1) return false; // cannot delete the only admin
    const idx = this.admins.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.admins.splice(idx, 1);
    return true;
  }

  verifyPassword(username: string, password: string): AdminUser | null {
    const admin = this.findByUsername(username);
    if (!admin) return null;
    if (admin.passwordHash !== this.hashPassword(password)) return null;
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

export async function registerAdmin(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; admin?: AdminUser }> {
  const admin = adminStore.register(username, email, password);
  if (!admin) {
    return {
      success: false,
      error: 'An admin account with that username or email already exists.',
    };
  }
  const token = generateSessionToken(admin);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return { success: true, admin };
}

export async function loginAdmin(
  username: string,
  password: string
): Promise<boolean> {
  const admin = adminStore.verifyPassword(username, password);
  if (!admin) return false;
  const token = generateSessionToken(admin);
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
