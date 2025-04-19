// Types de paiement mobile supportés
export enum MobilePaymentProvider {
  ORANGE_MONEY = 'ORANGE_MONEY',
  MTN_MOBILE_MONEY = 'MTN_MOBILE_MONEY',
  WAVE = 'WAVE',
  MPESA = 'MPESA',
  MOOV_MONEY = 'MOOV_MONEY',
  FREE_MONEY = 'FREE_MONEY',
}

// Pays supportés pour les paiements mobiles
export enum AfricanCountry {
  SENEGAL = 'SENEGAL',
  COTE_DIVOIRE = 'COTE_DIVOIRE',
  CAMEROUN = 'CAMEROUN',
  MALI = 'MALI',
  BURKINA_FASO = 'BURKINA_FASO',
  BENIN = 'BENIN',
  TOGO = 'TOGO',
  NIGER = 'NIGER',
  GUINEE = 'GUINEE',
  KENYA = 'KENYA',
  GHANA = 'GHANA',
  NIGERIA = 'NIGERIA',
}

// Statut d'un paiement
export enum PaymentStatus {
  PENDING = 'PENDING',
  INITIATED = 'INITIATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// Type de transaction (entrante ou sortante)
export enum PaymentDirection {
  INBOUND = 'INBOUND',   // Paiement reçu
  OUTBOUND = 'OUTBOUND', // Paiement envoyé
}

// Interface pour les informations de paiement mobile
export interface MobilePaymentInfo {
  provider: MobilePaymentProvider;
  phoneNumber: string;
  country: AfricanCountry;
  accountName?: string;
  accountId?: string;
}

// Interface pour une demande de paiement
export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  reference: string;
  paymentMethod: MobilePaymentInfo;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

// Interface pour une réponse de paiement
export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  transactionId?: string;
  providerReference?: string;
  message?: string;
  redirectUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour un paiement complet
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  status: PaymentStatus;
  direction: PaymentDirection;
  provider: MobilePaymentProvider;
  phoneNumber: string;
  country: AfricanCountry;
  transactionId?: string;
  providerReference?: string;
  metadata?: Record<string, any>;
  clientId?: number;
  supplierId?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

// Interface pour les options de configuration d'un fournisseur de paiement
export interface PaymentProviderConfig {
  apiKey: string;
  apiSecret?: string;
  merchantId?: string;
  environment: 'sandbox' | 'production';
  callbackUrl?: string;
  webhookUrl?: string;
  additionalConfig?: Record<string, any>;
}

// Interface pour les statistiques de paiement
export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  averageAmount: number;
  byProvider: Record<MobilePaymentProvider, {
    count: number;
    amount: number;
  }>;
  byCountry: Record<AfricanCountry, {
    count: number;
    amount: number;
  }>;
}

// Interface pour les filtres de recherche de paiements
export interface PaymentFilters {
  startDate?: string;
  endDate?: string;
  status?: PaymentStatus;
  provider?: MobilePaymentProvider;
  country?: AfricanCountry;
  direction?: PaymentDirection;
  minAmount?: number;
  maxAmount?: number;
  reference?: string;
  phoneNumber?: string;
  clientId?: number;
  supplierId?: number;
}
