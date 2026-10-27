export type SoundLevel = 'Low / Muffled' | 'Medium' | 'High Thrill' | 'No Sound (Visual Sparkle)';

export type RequirementType = 
  | 'Diwali / Festive Family Pack'
  | 'Wedding & Celebration'
  | 'Temple / Community Festival'
  | 'Institutional Bulk Purchase'
  | 'General In-Store Visit';

export type InquiryStatus = 'Pending' | 'Contacted' | 'Store Visited' | 'Completed' | 'Cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  description: string;
  retailPrice: number;
  stockQuantity: number;
  soundLevel: SoundLevel;
  durationSeconds?: number;
  piecesPerPack: number;
  isGreenCracker: boolean;
  greenCrackerCode?: string;
  safetyDistanceMeters: number;
  imageUrl: string;
  active: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Inquiry {
  id: string;
  refId: string;
  customerName: string;
  phone: string;
  email?: string;
  visitDate: string;
  requirementType: RequirementType;
  notes?: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'restock' | 'sale_in_store' | 'damaged' | 'adjustment';
  quantityChange: number;
  newStockCount: number;
  reason?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  adminUser: string;
  timestamp: string;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  operatingHours: string;
  pesoLicense: string;
  gstin: string;
}
