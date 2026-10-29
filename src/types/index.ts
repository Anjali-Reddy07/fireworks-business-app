export type SoundLevel = 'Low / Muffled' | 'Medium' | 'High Thrill' | 'No Sound (Visual Sparkle)';

export type RequirementType = 
  | 'Diwali Festive Family Pack'
  | 'Wedding & Celebration Special'
  | 'Temple / Community Festival'
  | 'Corporate & Bulk Gift Hampers'
  | 'Custom Cracker Selection';

export type InquiryStatus = 'Pending' | 'Contacted' | 'Quote Sent' | 'Confirmed' | 'Cancelled';

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
  festivalDate: string;
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
  seasonalOperatingNote: string;
  pesoLicense: string;
  gstin: string;
}
