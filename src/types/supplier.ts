import { Transaction } from './transaction';

export type SupplierStatus = 'actif' | 'inactif' | 'archivé';

export interface SupplierFilters {
  status: 'all' | SupplierStatus;
  country: string;
  category: string;
  hasOutstandingPayable: 'all' | boolean;
  sortBy: 'name' | 'lastOrderDate' | 'totalPurchases' | 'outstandingPayable';
  sortOrder: 'asc' | 'desc';
}

export interface SupplierFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  country: string;
  taxId?: string;
  website?: string;
  category: string;
  status: SupplierStatus;
  notes?: string;
}

export interface SupplierContact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface SupplierDocument {
  id: number;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadDate: string;
}

export interface SupplierNote {
  id: number;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  country: string;
  taxId?: string;
  website?: string;
  category: string;
  totalPurchases: number;
  outstandingPayable: number;
  status: SupplierStatus;
  lastOrderDate: string;
  createdAt: string;
  updatedAt: string;
  contacts?: SupplierContact[];
  notes?: SupplierNote[];
  documents?: SupplierDocument[];
  transactions?: Transaction[];
}
