import { AfricanCurrency } from '../utils/currencies';

export type TransactionType = 'REVENU' | 'DEPENSE';
export type TransactionStatus = 'EN_ATTENTE' | 'VALIDEE' | 'ANNULEE';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
}

export interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  uploadDate: string;
  transactionId: number;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  status: TransactionStatus;
  categoryId: number;
  category?: Category;
  tags?: Tag[];
  attachments?: Attachment[];
  reference?: string;
  currency: AfricanCurrency;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: number;
  tagIds?: number[];
  reference?: string;
  currency: AfricanCurrency;
  notes?: string;
  attachments?: File[];
}
