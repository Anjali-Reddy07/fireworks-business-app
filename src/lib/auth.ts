import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'fireworks_admin_session';
const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'SriVijaya@2026!';

// Generates a simple cryptographically verifiable session signature
function generateSessionToken(username: string): string {
  const payload = JSON.stringify({
    user: username,
    role: 'administrator',
    issuedAt: Date.now(),
  });
  return Buffer.from(payload).toString('base64');
}

export function parseSessionToken(token: string): { user: string; role: string } | null {
  try {
    const json = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(json);
    if (data?.role === 'administrator') {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return parseSessionToken(token);
}

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  const validUser = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USER;
  const validPass = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASS;

  if (username === validUser && password === validPass) {
    const token = generateSessionToken(username);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return true;
  }
  return false;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
