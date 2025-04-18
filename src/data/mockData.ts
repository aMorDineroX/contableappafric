import { Transaction, Category, Tag, TransactionType, TransactionStatus } from '../types/transaction';
import { Currency } from '../utils/currencies';

// Catégories
export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Salaire',
    type: 'REVENU',
    color: '#4CAF50',
    icon: 'cash'
  },
  {
    id: 2,
    name: 'Ventes',
    type: 'REVENU',
    color: '#2196F3',
    icon: 'shopping-cart'
  },
  {
    id: 3,
    name: 'Investissements',
    type: 'REVENU',
    color: '#9C27B0',
    icon: 'trending-up'
  },
  {
    id: 4,
    name: 'Alimentation',
    type: 'DEPENSE',
    color: '#F44336',
    icon: 'food'
  },
  {
    id: 5,
    name: 'Transport',
    type: 'DEPENSE',
    color: '#FF9800',
    icon: 'car'
  },
  {
    id: 6,
    name: 'Logement',
    type: 'DEPENSE',
    color: '#795548',
    icon: 'home'
  },
  {
    id: 7,
    name: 'Santé',
    type: 'DEPENSE',
    color: '#E91E63',
    icon: 'medical-bag'
  },
  {
    id: 8,
    name: 'Éducation',
    type: 'DEPENSE',
    color: '#673AB7',
    icon: 'school'
  }
];

// Tags
export const mockTags: Tag[] = [
  {
    id: 1,
    name: 'Personnel',
    color: '#4CAF50'
  },
  {
    id: 2,
    name: 'Professionnel',
    color: '#2196F3'
  },
  {
    id: 3,
    name: 'Urgent',
    color: '#F44336'
  },
  {
    id: 4,
    name: 'Récurrent',
    color: '#FF9800'
  },
  {
    id: 5,
    name: 'Famille',
    color: '#9C27B0'
  }
];

// Fonction pour générer une date aléatoire dans les 3 derniers mois
const getRandomDate = () => {
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const randomTimestamp = threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime());
  return new Date(randomTimestamp).toISOString().split('T')[0];
};

// Fonction pour générer un statut aléatoire
const getRandomStatus = (): TransactionStatus => {
  const statuses: TransactionStatus[] = ['VALIDEE', 'EN_ATTENTE', 'ANNULEE'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

// Fonction pour générer des tags aléatoires
const getRandomTags = (): Tag[] => {
  const shuffled = [...mockTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3)); // 0 à 2 tags
};

// Fonction pour générer une devise aléatoire
const getRandomCurrency = (): Currency => {
  // Utiliser toutes les devises disponibles
  const currencies: Currency[] = [
    // Devises africaines
    'XOF', 'XAF', 'NGN', 'GHS', 'KES', 'MAD', 'ZAR',
    // Devises internationales
    'USD', 'EUR',
    // Crypto (plus rare)
    ...(Math.random() < 0.05 ? ['BTC'] : [])
  ];
  const randomIndex = Math.floor(Math.random() * currencies.length);
  return currencies[randomIndex];
};

// Transactions
export const generateMockTransactions = (count: number = 20): Transaction[] => {
  const transactions: Transaction[] = [];

  for (let i = 1; i <= count; i++) {
    const type: TransactionType = Math.random() > 0.4 ? 'DEPENSE' : 'REVENU';
    const categoryPool = mockCategories.filter(cat => cat.type === type);
    const category = categoryPool[Math.floor(Math.random() * categoryPool.length)];
    const date = getRandomDate();
    const currency = getRandomCurrency();

    const transaction: Transaction = {
      id: i,
      amount: Math.floor(Math.random() * 1000000) / 100, // Montant entre 0 et 10000
      type,
      description: type === 'REVENU'
        ? `${category.name} - ${new Date(date).toLocaleDateString('fr-FR', { month: 'long' })}`
        : `Paiement ${category.name} - ${new Date(date).toLocaleDateString('fr-FR', { month: 'long' })}`,
      date,
      status: getRandomStatus(),
      categoryId: category.id,
      category,
      tags: getRandomTags(),
      reference: `REF-${Math.floor(Math.random() * 10000)}`,
      currency,
      notes: Math.random() > 0.7 ? `Notes supplémentaires pour la transaction #${i}` : undefined,
      createdAt: date,
      updatedAt: date
    };

    // Ajouter des pièces jointes aléatoires
    if (Math.random() > 0.7) {
      transaction.attachments = [
        {
          id: i * 100,
          fileName: `facture-${i}.pdf`,
          fileType: 'application/pdf',
          fileSize: Math.floor(Math.random() * 5000000), // Taille entre 0 et 5MB
          url: `https://example.com/attachments/facture-${i}.pdf`,
          thumbnailUrl: `https://example.com/attachments/thumbnails/facture-${i}.jpg`,
          uploadDate: date,
          transactionId: i
        }
      ];
    }

    transactions.push(transaction);
  }

  return transactions;
};

// Générer 20 transactions par défaut
export const mockTransactions = generateMockTransactions(20);
