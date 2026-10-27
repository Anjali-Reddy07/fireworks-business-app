import { createClient } from '@supabase/supabase-js';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './data/sample-products';
import { Category, Product, Inquiry, StockMovement, ActivityLog } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Public client for client components
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-only client with service role for admin tasks
export const getAdminSupabase = () => {
  if (supabaseUrl && supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return null;
};

// In-Memory Dev Store for development before Supabase keys are configured
class DevStore {
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private inquiries: Inquiry[] = [
    {
      id: 'inq-sample-1',
      refId: 'INQ-2026-9481',
      customerName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.k@gmail.com',
      visitDate: '2026-11-02',
      requirementType: 'Diwali / Festive Family Pack',
      notes: 'Looking for child-safe green sparklers and family assortment box.',
      status: 'Contacted',
      createdAt: '2026-10-25T14:30:00Z',
    },
    {
      id: 'inq-sample-2',
      refId: 'INQ-2026-3829',
      customerName: 'Meenakshi Sundaram',
      phone: '+91 94431 87654',
      visitDate: '2026-11-05',
      requirementType: 'Wedding & Celebration',
      notes: 'Require 12-shot aerial repeater cakes and golden anars for wedding reception.',
      status: 'Pending',
      createdAt: '2026-10-27T09:15:00Z',
    },
  ];
  private stockMovements: StockMovement[] = [
    {
      id: 'sm-001',
      productId: 'prod-001',
      productName: '30cm Royal Golden Sparklers (10 Pcs)',
      type: 'restock',
      quantityChange: 100,
      newStockCount: 145,
      reason: 'Batch arrival from Sivakasi factory',
      createdAt: '2026-10-20T10:00:00Z',
    },
    {
      id: 'sm-002',
      productId: 'prod-007',
      productName: '12 Shots Multi-Colour Aerial Repeater Cake',
      type: 'sale_in_store',
      quantityChange: -5,
      newStockCount: 35,
      reason: 'Walk-in retail customer billing',
      createdAt: '2026-10-26T16:45:00Z',
    },
  ];
  private logs: ActivityLog[] = [
    {
      id: 'log-001',
      action: 'SYSTEM_INIT',
      details: 'Application database initialized with 11 certified products and 6 categories',
      adminUser: 'System Administrator',
      timestamp: '2026-10-27T20:30:00Z',
    },
  ];

  // Products
  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  saveProduct(product: Product): Product {
    const existingIndex = this.products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = { ...product, updatedAt: new Date().toISOString() };
      this.addLog('PRODUCT_UPDATED', `Product "${product.name}" was modified.`);
      return this.products[existingIndex];
    } else {
      const newProduct = {
        ...product,
        id: product.id || `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      this.products.unshift(newProduct);
      this.addLog('PRODUCT_CREATED', `New product "${newProduct.name}" added to catalogue.`);
      return newProduct;
    }
  }

  deleteProduct(id: string): boolean {
    const p = this.products.find((x) => x.id === id);
    if (p) {
      this.products = this.products.filter((x) => x.id !== id);
      this.addLog('PRODUCT_DELETED', `Product "${p.name}" (ID: ${id}) was deleted.`);
      return true;
    }
    return false;
  }

  updateStock(productId: string, quantityChange: number, type: StockMovement['type'], reason: string): Product | null {
    const p = this.products.find((x) => x.id === productId);
    if (!p) return null;

    p.stockQuantity = Math.max(0, p.stockQuantity + quantityChange);
    p.updatedAt = new Date().toISOString();

    const movement: StockMovement = {
      id: `sm-${Date.now()}`,
      productId: p.id,
      productName: p.name,
      type,
      quantityChange,
      newStockCount: p.stockQuantity,
      reason,
      createdAt: new Date().toISOString(),
    };
    this.stockMovements.unshift(movement);
    this.addLog('STOCK_UPDATED', `Stock for "${p.name}" adjusted by ${quantityChange > 0 ? '+' : ''}${quantityChange} (New balance: ${p.stockQuantity}).`);

    return p;
  }

  // Categories
  getCategories(): Category[] {
    return this.categories;
  }

  // Inquiries
  getInquiries(): Inquiry[] {
    return this.inquiries;
  }

  saveInquiry(inquiry: Omit<Inquiry, 'id' | 'refId' | 'status' | 'createdAt'>): Inquiry {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newInquiry: Inquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      refId: `INQ-2026-${randomDigits}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    this.inquiries.unshift(newInquiry);
    this.addLog('INQUIRY_RECEIVED', `Store visit inquiry #${newInquiry.refId} received from ${newInquiry.customerName} (${newInquiry.phone}).`);
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: Inquiry['status']): Inquiry | null {
    const inq = this.inquiries.find((x) => x.id === id);
    if (!inq) return null;
    inq.status = status;
    this.addLog('INQUIRY_STATUS_CHANGED', `Inquiry #${inq.refId} status changed to "${status}".`);
    return inq;
  }

  // Stock Movements
  getStockMovements(): StockMovement[] {
    return this.stockMovements;
  }

  // Logs
  getLogs(): ActivityLog[] {
    return this.logs;
  }

  addLog(action: string, details: string, adminUser = 'Admin') {
    this.logs.unshift({
      id: `log-${Date.now()}`,
      action,
      details,
      adminUser,
      timestamp: new Date().toISOString(),
    });
  }
}

// Global singleton for dev store across HMR
const globalForDev = global as unknown as { devStoreInstance?: DevStore };
export const devStore = globalForDev.devStoreInstance ?? new DevStore();
if (process.env.NODE_ENV !== 'production') globalForDev.devStoreInstance = devStore;
