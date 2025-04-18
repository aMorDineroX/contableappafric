import { Transaction } from './transaction';

export type ClientStatus = 'actif' | 'inactif' | 'prospect' | 'archivé';

export interface ClientContact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface ClientDocument {
  id: number;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadDate: string;
}

export interface ClientNote {
  id: number;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Client {
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
  totalSales: number;
  outstandingBalance: number;
  status: ClientStatus;
  lastOrderDate: string;
  createdAt: string;
  updatedAt: string;
  contacts?: ClientContact[];
  notes?: ClientNote[];
  documents?: ClientDocument[];
  transactions?: Transaction[];
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  country: string;
  taxId?: string;
  website?: string;
  status: ClientStatus;
  notes?: string;
}
