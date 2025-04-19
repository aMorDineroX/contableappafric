import {
  Payment,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  PaymentDirection,
  MobilePaymentProvider,
  AfricanCountry,
  PaymentFilters,
  PaymentStats,
  PaymentProviderConfig
} from '../types/payment';

// Fonction utilitaire pour simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Données fictives pour les paiements
const mockPayments: Payment[] = [
  {
    id: '1',
    amount: 25000,
    currency: 'XOF',
    description: 'Paiement facture #INV-2023-001',
    reference: 'INV-2023-001',
    status: PaymentStatus.COMPLETED,
    direction: PaymentDirection.INBOUND,
    provider: MobilePaymentProvider.ORANGE_MONEY,
    phoneNumber: '+221771234567',
    country: AfricanCountry.SENEGAL,
    transactionId: 'OM123456789',
    providerReference: 'REF-OM-123456',
    clientId: 1,
    createdAt: '2023-11-15T10:30:00Z',
    updatedAt: '2023-11-15T10:35:00Z',
    completedAt: '2023-11-15T10:35:00Z',
  },
  {
    id: '2',
    amount: 15000,
    currency: 'XOF',
    description: 'Paiement fournisseur #SUP-2023-001',
    reference: 'SUP-2023-001',
    status: PaymentStatus.COMPLETED,
    direction: PaymentDirection.OUTBOUND,
    provider: MobilePaymentProvider.MTN_MOBILE_MONEY,
    phoneNumber: '+22507654321',
    country: AfricanCountry.COTE_DIVOIRE,
    transactionId: 'MTN987654321',
    providerReference: 'REF-MTN-987654',
    supplierId: 2,
    createdAt: '2023-11-10T14:20:00Z',
    updatedAt: '2023-11-10T14:25:00Z',
    completedAt: '2023-11-10T14:25:00Z',
  },
  {
    id: '3',
    amount: 50000,
    currency: 'XOF',
    description: 'Paiement facture #INV-2023-002',
    reference: 'INV-2023-002',
    status: PaymentStatus.PENDING,
    direction: PaymentDirection.INBOUND,
    provider: MobilePaymentProvider.WAVE,
    phoneNumber: '+221781234567',
    country: AfricanCountry.SENEGAL,
    clientId: 3,
    createdAt: '2023-11-18T09:15:00Z',
    updatedAt: '2023-11-18T09:15:00Z',
  },
  {
    id: '4',
    amount: 35000,
    currency: 'XOF',
    description: 'Paiement fournisseur #SUP-2023-002',
    reference: 'SUP-2023-002',
    status: PaymentStatus.FAILED,
    direction: PaymentDirection.OUTBOUND,
    provider: MobilePaymentProvider.ORANGE_MONEY,
    phoneNumber: '+22565432109',
    country: AfricanCountry.COTE_DIVOIRE,
    supplierId: 1,
    createdAt: '2023-11-12T16:40:00Z',
    updatedAt: '2023-11-12T16:45:00Z',
    failureReason: 'Solde insuffisant',
  },
  {
    id: '5',
    amount: 75000,
    currency: 'KES',
    description: 'Paiement facture #INV-2023-003',
    reference: 'INV-2023-003',
    status: PaymentStatus.COMPLETED,
    direction: PaymentDirection.INBOUND,
    provider: MobilePaymentProvider.MPESA,
    phoneNumber: '+254712345678',
    country: AfricanCountry.KENYA,
    transactionId: 'MPESA123456789',
    providerReference: 'REF-MPESA-123456',
    clientId: 2,
    createdAt: '2023-11-05T11:20:00Z',
    updatedAt: '2023-11-05T11:25:00Z',
    completedAt: '2023-11-05T11:25:00Z',
  },
];

// Configuration des fournisseurs de paiement
const providerConfigs: Record<MobilePaymentProvider, PaymentProviderConfig> = {
  [MobilePaymentProvider.ORANGE_MONEY]: {
    apiKey: 'om_test_api_key',
    apiSecret: 'om_test_api_secret',
    merchantId: 'om_test_merchant_id',
    environment: 'sandbox',
    callbackUrl: 'https://api.contafricax.com/callbacks/orange-money',
    webhookUrl: 'https://api.contafricax.com/webhooks/orange-money',
    additionalConfig: {
      channelUserMsisdn: '+221771234567',
      pinCode: '1234',
    },
  },
  [MobilePaymentProvider.MTN_MOBILE_MONEY]: {
    apiKey: 'mtn_test_api_key',
    apiSecret: 'mtn_test_api_secret',
    merchantId: 'mtn_test_merchant_id',
    environment: 'sandbox',
    callbackUrl: 'https://api.contafricax.com/callbacks/mtn-mobile-money',
    webhookUrl: 'https://api.contafricax.com/webhooks/mtn-mobile-money',
  },
  [MobilePaymentProvider.WAVE]: {
    apiKey: 'wave_test_api_key',
    apiSecret: 'wave_test_api_secret',
    environment: 'sandbox',
    callbackUrl: 'https://api.contafricax.com/callbacks/wave',
    webhookUrl: 'https://api.contafricax.com/webhooks/wave',
  },
  [MobilePaymentProvider.MPESA]: {
    apiKey: 'mpesa_test_api_key',
    apiSecret: 'mpesa_test_api_secret',
    merchantId: 'mpesa_test_merchant_id',
    environment: 'sandbox',
    callbackUrl: 'https://api.contafricax.com/callbacks/mpesa',
    webhookUrl: 'https://api.contafricax.com/webhooks/mpesa',
    additionalConfig: {
      shortCode: '174379',
      passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    },
  },
  [MobilePaymentProvider.MOOV_MONEY]: {
    apiKey: 'moov_test_api_key',
    apiSecret: 'moov_test_api_secret',
    merchantId: 'moov_test_merchant_id',
    environment: 'sandbox',
    callbackUrl: 'https://api.contafricax.com/callbacks/moov-money',
    webhookUrl: 'https://api.contafricax.com/webhooks/moov-money',
  },
  [MobilePaymentProvider.FREE_MONEY]: {
    apiKey: 'free_test_api_key',
    apiSecret: 'free_test_api_secret',
    merchantId: 'free_test_merchant_id',
    environment: 'sandbox',
    callbackUrl: 'https://api.contafricax.com/callbacks/free-money',
    webhookUrl: 'https://api.contafricax.com/webhooks/free-money',
  },
};

// Disponibilité des fournisseurs par pays
const providersByCountry: Record<AfricanCountry, MobilePaymentProvider[]> = {
  [AfricanCountry.SENEGAL]: [
    MobilePaymentProvider.ORANGE_MONEY,
    MobilePaymentProvider.FREE_MONEY,
    MobilePaymentProvider.WAVE,
    MobilePaymentProvider.MTN_MOBILE_MONEY,
  ],
  [AfricanCountry.COTE_DIVOIRE]: [
    MobilePaymentProvider.ORANGE_MONEY,
    MobilePaymentProvider.MTN_MOBILE_MONEY,
    MobilePaymentProvider.WAVE,
    MobilePaymentProvider.MOOV_MONEY,
  ],
  [AfricanCountry.CAMEROUN]: [
    MobilePaymentProvider.ORANGE_MONEY,
    MobilePaymentProvider.MTN_MOBILE_MONEY,
  ],
  [AfricanCountry.MALI]: [
    MobilePaymentProvider.ORANGE_MONEY,
    MobilePaymentProvider.MOOV_MONEY,
  ],
  [AfricanCountry.BURKINA_FASO]: [
    MobilePaymentProvider.ORANGE_MONEY,
    MobilePaymentProvider.MOOV_MONEY,
  ],
  [AfricanCountry.BENIN]: [
    MobilePaymentProvider.MTN_MOBILE_MONEY,
    MobilePaymentProvider.MOOV_MONEY,
  ],
  [AfricanCountry.TOGO]: [
    MobilePaymentProvider.MOOV_MONEY,
  ],
  [AfricanCountry.NIGER]: [
    MobilePaymentProvider.ORANGE_MONEY,
    MobilePaymentProvider.MOOV_MONEY,
  ],
  [AfricanCountry.GUINEE]: [
    MobilePaymentProvider.ORANGE_MONEY,
    MobilePaymentProvider.MTN_MOBILE_MONEY,
  ],
  [AfricanCountry.KENYA]: [
    MobilePaymentProvider.MPESA,
  ],
  [AfricanCountry.GHANA]: [
    MobilePaymentProvider.MTN_MOBILE_MONEY,
  ],
  [AfricanCountry.NIGERIA]: [
    MobilePaymentProvider.MTN_MOBILE_MONEY,
  ],
};

// API pour les paiements mobiles
export const MobilePaymentAPI = {
  // Récupérer tous les paiements
  getAll: async (filters?: PaymentFilters): Promise<Payment[]> => {
    await delay(800);
    
    if (!filters) {
      return [...mockPayments];
    }
    
    return mockPayments.filter(payment => {
      // Filtrer par date
      if (filters.startDate && new Date(payment.createdAt) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(payment.createdAt) > new Date(filters.endDate)) {
        return false;
      }
      
      // Filtrer par statut
      if (filters.status && payment.status !== filters.status) {
        return false;
      }
      
      // Filtrer par fournisseur
      if (filters.provider && payment.provider !== filters.provider) {
        return false;
      }
      
      // Filtrer par pays
      if (filters.country && payment.country !== filters.country) {
        return false;
      }
      
      // Filtrer par direction
      if (filters.direction && payment.direction !== filters.direction) {
        return false;
      }
      
      // Filtrer par montant
      if (filters.minAmount && payment.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount && payment.amount > filters.maxAmount) {
        return false;
      }
      
      // Filtrer par référence
      if (filters.reference && !payment.reference.includes(filters.reference)) {
        return false;
      }
      
      // Filtrer par numéro de téléphone
      if (filters.phoneNumber && !payment.phoneNumber.includes(filters.phoneNumber)) {
        return false;
      }
      
      // Filtrer par client
      if (filters.clientId && payment.clientId !== filters.clientId) {
        return false;
      }
      
      // Filtrer par fournisseur
      if (filters.supplierId && payment.supplierId !== filters.supplierId) {
        return false;
      }
      
      return true;
    });
  },
  
  // Récupérer un paiement par son ID
  getById: async (id: string): Promise<Payment> => {
    await delay(300);
    
    const payment = mockPayments.find(p => p.id === id);
    if (!payment) {
      throw new Error(`Paiement avec l'ID ${id} non trouvé`);
    }
    
    return { ...payment };
  },
  
  // Initier un nouveau paiement
  initiatePayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    await delay(1000);
    
    // Vérifier si le fournisseur est disponible dans le pays spécifié
    const availableProviders = providersByCountry[request.paymentMethod.country] || [];
    if (!availableProviders.includes(request.paymentMethod.provider)) {
      throw new Error(`Le fournisseur ${request.paymentMethod.provider} n'est pas disponible dans ${request.paymentMethod.country}`);
    }
    
    // Simuler une réponse de paiement
    const now = new Date().toISOString();
    const paymentId = `PAY-${Date.now()}`;
    
    // Simuler un échec aléatoire (10% de chance)
    const shouldFail = Math.random() < 0.1;
    
    if (shouldFail) {
      return {
        id: paymentId,
        status: PaymentStatus.FAILED,
        message: 'Échec de l\'initiation du paiement. Veuillez réessayer.',
        createdAt: now,
        updatedAt: now,
      };
    }
    
    // Simuler une redirection vers la page de paiement du fournisseur
    const redirectUrl = `https://payment.example.com/${request.paymentMethod.provider.toLowerCase()}/checkout?ref=${paymentId}`;
    
    return {
      id: paymentId,
      status: PaymentStatus.INITIATED,
      transactionId: `TXN-${Date.now()}`,
      providerReference: `REF-${request.paymentMethod.provider}-${Date.now()}`,
      message: 'Paiement initié avec succès. Veuillez suivre les instructions pour compléter le paiement.',
      redirectUrl,
      createdAt: now,
      updatedAt: now,
    };
  },
  
  // Vérifier le statut d'un paiement
  checkPaymentStatus: async (paymentId: string): Promise<PaymentStatus> => {
    await delay(500);
    
    const payment = mockPayments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error(`Paiement avec l'ID ${paymentId} non trouvé`);
    }
    
    return payment.status;
  },
  
  // Annuler un paiement
  cancelPayment: async (paymentId: string): Promise<PaymentResponse> => {
    await delay(800);
    
    const payment = mockPayments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error(`Paiement avec l'ID ${paymentId} non trouvé`);
    }
    
    if (payment.status !== PaymentStatus.PENDING && payment.status !== PaymentStatus.INITIATED) {
      throw new Error(`Impossible d'annuler un paiement avec le statut ${payment.status}`);
    }
    
    // Mettre à jour le statut du paiement
    payment.status = PaymentStatus.CANCELLED;
    payment.updatedAt = new Date().toISOString();
    
    return {
      id: payment.id,
      status: PaymentStatus.CANCELLED,
      message: 'Paiement annulé avec succès',
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  },
  
  // Rembourser un paiement
  refundPayment: async (paymentId: string, amount?: number): Promise<PaymentResponse> => {
    await delay(1200);
    
    const payment = mockPayments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error(`Paiement avec l'ID ${paymentId} non trouvé`);
    }
    
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new Error(`Impossible de rembourser un paiement avec le statut ${payment.status}`);
    }
    
    // Vérifier le montant du remboursement
    const refundAmount = amount || payment.amount;
    if (refundAmount > payment.amount) {
      throw new Error(`Le montant du remboursement ne peut pas dépasser le montant du paiement`);
    }
    
    // Mettre à jour le statut du paiement
    payment.status = PaymentStatus.REFUNDED;
    payment.updatedAt = new Date().toISOString();
    
    return {
      id: payment.id,
      status: PaymentStatus.REFUNDED,
      message: `Remboursement de ${refundAmount} ${payment.currency} effectué avec succès`,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  },
  
  // Obtenir les statistiques de paiement
  getPaymentStats: async (filters?: PaymentFilters): Promise<PaymentStats> => {
    await delay(1000);
    
    // Filtrer les paiements selon les critères
    let filteredPayments = mockPayments;
    if (filters) {
      filteredPayments = await MobilePaymentAPI.getAll(filters);
    }
    
    // Calculer les statistiques
    const totalPayments = filteredPayments.length;
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const successfulPayments = filteredPayments.filter(p => p.status === PaymentStatus.COMPLETED).length;
    const failedPayments = filteredPayments.filter(p => p.status === PaymentStatus.FAILED).length;
    const pendingPayments = filteredPayments.filter(p => [PaymentStatus.PENDING, PaymentStatus.INITIATED, PaymentStatus.PROCESSING].includes(p.status)).length;
    const averageAmount = totalPayments > 0 ? totalAmount / totalPayments : 0;
    
    // Statistiques par fournisseur
    const byProvider: Record<MobilePaymentProvider, { count: number; amount: number }> = Object.values(MobilePaymentProvider).reduce((acc, provider) => {
      acc[provider] = { count: 0, amount: 0 };
      return acc;
    }, {} as Record<MobilePaymentProvider, { count: number; amount: number }>);
    
    // Statistiques par pays
    const byCountry: Record<AfricanCountry, { count: number; amount: number }> = Object.values(AfricanCountry).reduce((acc, country) => {
      acc[country] = { count: 0, amount: 0 };
      return acc;
    }, {} as Record<AfricanCountry, { count: number; amount: number }>);
    
    // Remplir les statistiques
    filteredPayments.forEach(payment => {
      byProvider[payment.provider].count += 1;
      byProvider[payment.provider].amount += payment.amount;
      
      byCountry[payment.country].count += 1;
      byCountry[payment.country].amount += payment.amount;
    });
    
    return {
      totalPayments,
      totalAmount,
      successfulPayments,
      failedPayments,
      pendingPayments,
      averageAmount,
      byProvider,
      byCountry,
    };
  },
  
  // Obtenir les fournisseurs disponibles par pays
  getAvailableProviders: async (country: AfricanCountry): Promise<MobilePaymentProvider[]> => {
    await delay(300);
    return providersByCountry[country] || [];
  },
  
  // Obtenir tous les pays supportés
  getSupportedCountries: async (): Promise<AfricanCountry[]> => {
    await delay(300);
    return Object.keys(providersByCountry) as AfricanCountry[];
  },
  
  // Vérifier si un numéro de téléphone est valide pour un fournisseur et un pays
  validatePhoneNumber: async (
    phoneNumber: string,
    provider: MobilePaymentProvider,
    country: AfricanCountry
  ): Promise<{ isValid: boolean; message?: string }> => {
    await delay(500);
    
    // Vérifier si le fournisseur est disponible dans le pays
    const availableProviders = providersByCountry[country] || [];
    if (!availableProviders.includes(provider)) {
      return {
        isValid: false,
        message: `Le fournisseur ${provider} n'est pas disponible dans ${country}`,
      };
    }
    
    // Vérifier le format du numéro de téléphone selon le pays
    let isValid = false;
    let message = '';
    
    switch (country) {
      case AfricanCountry.SENEGAL:
        isValid = /^\+221[76|77|78]\d{7}$/.test(phoneNumber);
        message = isValid ? 'Numéro valide' : 'Le numéro doit commencer par +221 suivi de 76, 77 ou 78 et 7 chiffres';
        break;
      case AfricanCountry.COTE_DIVOIRE:
        isValid = /^\+225\d{10}$/.test(phoneNumber);
        message = isValid ? 'Numéro valide' : 'Le numéro doit commencer par +225 suivi de 10 chiffres';
        break;
      case AfricanCountry.KENYA:
        isValid = /^\+254[7|1]\d{8}$/.test(phoneNumber);
        message = isValid ? 'Numéro valide' : 'Le numéro doit commencer par +254 suivi de 7 ou 1 et 8 chiffres';
        break;
      default:
        isValid = /^\+\d{1,3}\d{9,12}$/.test(phoneNumber);
        message = isValid ? 'Numéro valide' : 'Format de numéro invalide';
    }
    
    return { isValid, message };
  },
};

// Adaptateurs spécifiques pour chaque fournisseur de paiement
export const OrangeMoneyAdapter = {
  // Initier un paiement Orange Money
  initiatePayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    if (request.paymentMethod.provider !== MobilePaymentProvider.ORANGE_MONEY) {
      throw new Error('Ce fournisseur ne prend en charge que les paiements Orange Money');
    }
    
    // Logique spécifique à Orange Money
    await delay(1200);
    
    // Simuler une réponse de paiement
    const now = new Date().toISOString();
    const paymentId = `OM-${Date.now()}`;
    
    return {
      id: paymentId,
      status: PaymentStatus.INITIATED,
      transactionId: `OM-TXN-${Date.now()}`,
      providerReference: `OM-REF-${Date.now()}`,
      message: 'Paiement Orange Money initié. Veuillez confirmer sur votre téléphone.',
      redirectUrl: `https://payment.orangemoney.com/checkout?ref=${paymentId}`,
      createdAt: now,
      updatedAt: now,
    };
  },
  
  // Vérifier le statut d'un paiement Orange Money
  checkPaymentStatus: async (paymentId: string): Promise<PaymentStatus> => {
    await delay(800);
    
    // Simuler un statut aléatoire
    const statuses = [
      PaymentStatus.PENDING,
      PaymentStatus.PROCESSING,
      PaymentStatus.COMPLETED,
      PaymentStatus.FAILED,
    ];
    
    return statuses[Math.floor(Math.random() * statuses.length)];
  },
};

export const MTNMobileMoneyAdapter = {
  // Initier un paiement MTN Mobile Money
  initiatePayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    if (request.paymentMethod.provider !== MobilePaymentProvider.MTN_MOBILE_MONEY) {
      throw new Error('Ce fournisseur ne prend en charge que les paiements MTN Mobile Money');
    }
    
    // Logique spécifique à MTN Mobile Money
    await delay(1000);
    
    // Simuler une réponse de paiement
    const now = new Date().toISOString();
    const paymentId = `MTN-${Date.now()}`;
    
    return {
      id: paymentId,
      status: PaymentStatus.INITIATED,
      transactionId: `MTN-TXN-${Date.now()}`,
      providerReference: `MTN-REF-${Date.now()}`,
      message: 'Paiement MTN Mobile Money initié. Veuillez confirmer sur votre téléphone.',
      redirectUrl: `https://payment.mtn.com/momo/checkout?ref=${paymentId}`,
      createdAt: now,
      updatedAt: now,
    };
  },
  
  // Vérifier le statut d'un paiement MTN Mobile Money
  checkPaymentStatus: async (paymentId: string): Promise<PaymentStatus> => {
    await delay(700);
    
    // Simuler un statut aléatoire
    const statuses = [
      PaymentStatus.PENDING,
      PaymentStatus.PROCESSING,
      PaymentStatus.COMPLETED,
      PaymentStatus.FAILED,
    ];
    
    return statuses[Math.floor(Math.random() * statuses.length)];
  },
};

export const WaveAdapter = {
  // Initier un paiement Wave
  initiatePayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    if (request.paymentMethod.provider !== MobilePaymentProvider.WAVE) {
      throw new Error('Ce fournisseur ne prend en charge que les paiements Wave');
    }
    
    // Logique spécifique à Wave
    await delay(900);
    
    // Simuler une réponse de paiement
    const now = new Date().toISOString();
    const paymentId = `WAVE-${Date.now()}`;
    
    return {
      id: paymentId,
      status: PaymentStatus.INITIATED,
      transactionId: `WAVE-TXN-${Date.now()}`,
      providerReference: `WAVE-REF-${Date.now()}`,
      message: 'Paiement Wave initié. Veuillez scanner le QR code ou confirmer sur votre téléphone.',
      redirectUrl: `https://payment.wave.com/checkout?ref=${paymentId}`,
      createdAt: now,
      updatedAt: now,
    };
  },
  
  // Vérifier le statut d'un paiement Wave
  checkPaymentStatus: async (paymentId: string): Promise<PaymentStatus> => {
    await delay(600);
    
    // Simuler un statut aléatoire
    const statuses = [
      PaymentStatus.PENDING,
      PaymentStatus.PROCESSING,
      PaymentStatus.COMPLETED,
      PaymentStatus.FAILED,
    ];
    
    return statuses[Math.floor(Math.random() * statuses.length)];
  },
};

export const MPesaAdapter = {
  // Initier un paiement M-Pesa
  initiatePayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    if (request.paymentMethod.provider !== MobilePaymentProvider.MPESA) {
      throw new Error('Ce fournisseur ne prend en charge que les paiements M-Pesa');
    }
    
    // Logique spécifique à M-Pesa
    await delay(1100);
    
    // Simuler une réponse de paiement
    const now = new Date().toISOString();
    const paymentId = `MPESA-${Date.now()}`;
    
    return {
      id: paymentId,
      status: PaymentStatus.INITIATED,
      transactionId: `MPESA-TXN-${Date.now()}`,
      providerReference: `MPESA-REF-${Date.now()}`,
      message: 'Paiement M-Pesa initié. Veuillez confirmer sur votre téléphone.',
      redirectUrl: `https://payment.mpesa.com/checkout?ref=${paymentId}`,
      createdAt: now,
      updatedAt: now,
    };
  },
  
  // Vérifier le statut d'un paiement M-Pesa
  checkPaymentStatus: async (paymentId: string): Promise<PaymentStatus> => {
    await delay(750);
    
    // Simuler un statut aléatoire
    const statuses = [
      PaymentStatus.PENDING,
      PaymentStatus.PROCESSING,
      PaymentStatus.COMPLETED,
      PaymentStatus.FAILED,
    ];
    
    return statuses[Math.floor(Math.random() * statuses.length)];
  },
};
