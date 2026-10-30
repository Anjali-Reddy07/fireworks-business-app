import { cookies } from 'next/headers';
import { collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CUSTOMER_COOKIE_NAME = 'fireworks_customer_session';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

function hashPassword(password: string): string {
  // Base64 hash with salt
  return Buffer.from(password + ':fireworks_salt_2026').toString('base64');
}

// In-memory customer store for fallback/dev
class CustomerStore {
  private customers: (CustomerUser & { passwordHash: string })[] = [];

  findByEmail(email: string) {
    return this.customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  }

  register(name: string, phone: string, email: string, password: string): CustomerUser | null {
    if (this.findByEmail(email)) return null;
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    this.customers.push(newCustomer);
    const { passwordHash: _, ...safe } = newCustomer;
    return safe;
  }

  verifyPassword(email: string, password: string): CustomerUser | null {
    const customer = this.findByEmail(email);
    if (!customer) return null;
    if (customer.passwordHash !== hashPassword(password)) return null;
    const { passwordHash: _, ...safe } = customer;
    return safe;
  }
}

const globalForCustomer = global as unknown as { customerStore?: CustomerStore };
const customerStore = globalForCustomer.customerStore ?? new CustomerStore();
if (process.env.NODE_ENV !== 'production') globalForCustomer.customerStore = customerStore;

// --- Session helpers ---

function generateCustomerToken(customer: CustomerUser): string {
  const payload = JSON.stringify({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    role: 'customer',
    issuedAt: Date.now(),
  });
  return Buffer.from(payload).toString('base64');
}

export function parseCustomerToken(token: string): CustomerUser | null {
  try {
    const json = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(json);
    if (data?.role === 'customer') {
      return { id: data.id, name: data.name, email: data.email, phone: data.phone, createdAt: data.createdAt || '' };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCustomerSession(): Promise<CustomerUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return parseCustomerToken(token);
}

export async function registerCustomer(
  name: string,
  phone: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; customer?: CustomerUser }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Check Firebase Firestore first
  try {
    const userQuery = query(collection(db, 'users'), where('email', '==', normalizedEmail));
    const snapshot = await getDocs(userQuery);
    if (!snapshot.empty) {
      return { success: false, error: 'An account with this email already exists.' };
    }
  } catch (err) {
    console.warn('[Firestore User Check Warning]:', err);
  }

  // Create user
  const userId = `cust-${Date.now()}`;
  const pwdHash = hashPassword(password);
  const newCustomerRecord = {
    id: userId,
    name: name.trim(),
    phone: phone.trim(),
    email: normalizedEmail,
    passwordHash: pwdHash,
    role: 'customer',
    admin: false,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };

  // Save to Firebase Firestore
  try {
    await setDoc(doc(db, 'users', userId), newCustomerRecord);
  } catch (err) {
    console.warn('[Firestore User Save Warning]:', err);
  }

  // Also register in memory
  const memoryCust = customerStore.register(name, phone, normalizedEmail, password);
  const safeCustomer: CustomerUser = {
    id: userId,
    name: name.trim(),
    phone: phone.trim(),
    email: normalizedEmail,
    createdAt: newCustomerRecord.createdAt,
  };

  const token = generateCustomerToken(safeCustomer);
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return { success: true, customer: safeCustomer };
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; customer?: CustomerUser }> {
  const normalizedEmail = email.trim().toLowerCase();
  const pwdHash = hashPassword(password);

  // Check Firebase Firestore
  try {
    const userQuery = query(collection(db, 'users'), where('email', '==', normalizedEmail));
    const snapshot = await getDocs(userQuery);
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0].data();
      if (userDoc.passwordHash === pwdHash) {
        const safeCustomer: CustomerUser = {
          id: userDoc.id || snapshot.docs[0].id,
          name: userDoc.name,
          phone: userDoc.phone,
          email: userDoc.email,
          createdAt: userDoc.createdAt || '',
        };
        const token = generateCustomerToken(safeCustomer);
        const cookieStore = await cookies();
        cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
        return { success: true, customer: safeCustomer };
      }
    }
  } catch (err) {
    console.warn('[Firestore User Login Warning]:', err);
  }

  // Fallback to in-memory check
  const customer = customerStore.verifyPassword(normalizedEmail, password);
  if (!customer) {
    return { success: false, error: 'Invalid email or password.' };
  }

  const token = generateCustomerToken(customer);
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return { success: true, customer };
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE_NAME);
}
