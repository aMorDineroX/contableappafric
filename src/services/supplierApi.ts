import { Supplier, SupplierFormData, SupplierNote } from '../types/supplier';

// Fonction utilitaire pour simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Données fictives pour les fournisseurs
const suppliersData: Supplier[] = [
  {
    id: 1,
    name: 'Fournitures Express',
    email: 'contact@fournitures-express.com',
    phone: '+221 77 123 45 67',
    address: '123 Rue des Fournisseurs, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    category: 'Fournitures de bureau',
    totalPurchases: 850000,
    outstandingPayable: 150000,
    status: 'actif',
    lastOrderDate: '2023-11-28',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-11-28T14:45:00Z',
    notes: [
      {
        id: 1,
        content: 'Fournisseur fiable avec des délais de livraison respectés',
        createdAt: '2023-02-10T09:15:00Z',
        createdBy: 'Admin'
      }
    ]
  },
  {
    id: 2,
    name: 'Tech Solutions',
    email: 'info@techsolutions.ci',
    phone: '+225 01 234 56 78',
    address: '45 Boulevard Technologique, Abidjan',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    category: 'Équipement informatique',
    totalPurchases: 1250000,
    outstandingPayable: 0,
    status: 'actif',
    lastOrderDate: '2023-12-05',
    createdAt: '2023-03-20T11:45:00Z',
    updatedAt: '2023-12-05T16:30:00Z',
    notes: [
      {
        id: 1,
        content: 'Offre des prix compétitifs pour le matériel informatique',
        createdAt: '2023-04-15T14:20:00Z',
        createdBy: 'Admin'
      }
    ]
  },
  {
    id: 3,
    name: 'Mobilier Pro',
    email: 'contact@mobilier-pro.sn',
    phone: '+221 33 987 65 43',
    address: '78 Avenue du Commerce, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    category: 'Mobilier de bureau',
    totalPurchases: 675000,
    outstandingPayable: 75000,
    status: 'actif',
    lastOrderDate: '2023-11-15',
    createdAt: '2023-02-05T09:20:00Z',
    updatedAt: '2023-11-15T13:10:00Z'
  },
  {
    id: 4,
    name: 'Imprimerie Centrale',
    email: 'info@imprimerie-centrale.ma',
    phone: '+212 522 33 44 55',
    address: '12 Rue de l\'Industrie, Casablanca',
    city: 'Casablanca',
    country: 'Maroc',
    category: 'Imprimerie',
    totalPurchases: 320000,
    outstandingPayable: 0,
    status: 'inactif',
    lastOrderDate: '2023-09-20',
    createdAt: '2023-05-12T08:30:00Z',
    updatedAt: '2023-09-20T11:25:00Z'
  },
  {
    id: 5,
    name: 'Logistique Afrique',
    email: 'contact@logistique-afrique.com',
    phone: '+225 07 876 54 32',
    address: '34 Zone Industrielle, Abidjan',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    category: 'Transport et logistique',
    totalPurchases: 980000,
    outstandingPayable: 230000,
    status: 'actif',
    lastOrderDate: '2023-12-01',
    createdAt: '2023-01-30T13:45:00Z',
    updatedAt: '2023-12-01T17:50:00Z'
  },
  {
    id: 6,
    name: 'Sécurité Plus',
    email: 'info@securiteplus.sn',
    phone: '+221 76 543 21 09',
    address: '56 Boulevard de la Sécurité, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    category: 'Équipement de sécurité',
    totalPurchases: 450000,
    outstandingPayable: 0,
    status: 'actif',
    lastOrderDate: '2023-11-10',
    createdAt: '2023-04-05T10:15:00Z',
    updatedAt: '2023-11-10T15:30:00Z'
  },
  {
    id: 7,
    name: 'Énergie Solaire SA',
    email: 'contact@energie-solaire.com',
    phone: '+221 70 123 45 67',
    address: '89 Rue de l\'Énergie, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    category: 'Énergie renouvelable',
    totalPurchases: 1500000,
    outstandingPayable: 350000,
    status: 'actif',
    lastOrderDate: '2023-12-10',
    createdAt: '2023-03-15T09:30:00Z',
    updatedAt: '2023-12-10T14:20:00Z'
  },
  {
    id: 8,
    name: 'Maintenance Industrielle',
    email: 'info@maintenance-ind.ma',
    phone: '+212 661 23 45 67',
    address: '23 Zone Industrielle, Tanger',
    city: 'Tanger',
    country: 'Maroc',
    category: 'Maintenance',
    totalPurchases: 280000,
    outstandingPayable: 0,
    status: 'inactif',
    lastOrderDate: '2023-08-15',
    createdAt: '2023-02-20T11:10:00Z',
    updatedAt: '2023-08-15T16:45:00Z'
  },
  {
    id: 9,
    name: 'Climatisation Pro',
    email: 'contact@climatisation-pro.sn',
    phone: '+221 77 987 65 43',
    address: '45 Avenue du Climat, Dakar',
    city: 'Dakar',
    country: 'Sénégal',
    category: 'Climatisation',
    totalPurchases: 720000,
    outstandingPayable: 120000,
    status: 'actif',
    lastOrderDate: '2023-11-25',
    createdAt: '2023-05-10T08:45:00Z',
    updatedAt: '2023-11-25T13:30:00Z'
  },
  {
    id: 10,
    name: 'Réseau Télécom',
    email: 'info@reseau-telecom.ci',
    phone: '+225 05 432 10 98',
    address: '67 Rue des Télécommunications, Abidjan',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    category: 'Télécommunications',
    totalPurchases: 950000,
    outstandingPayable: 0,
    status: 'actif',
    lastOrderDate: '2023-12-08',
    createdAt: '2023-06-01T10:20:00Z',
    updatedAt: '2023-12-08T15:15:00Z'
  }
];

// API Supplier
export const SupplierAPI = {
  // Récupérer tous les fournisseurs
  getAll: async (): Promise<Supplier[]> => {
    await delay(500);
    return [...suppliersData];
  },
  
  // Récupérer un fournisseur par son ID
  getById: async (id: number): Promise<Supplier> => {
    await delay(300);
    const supplier = suppliersData.find(s => s.id === id);
    if (!supplier) {
      throw new Error(`Fournisseur avec l'ID ${id} non trouvé`);
    }
    return { ...supplier };
  },
  
  // Créer un nouveau fournisseur
  create: async (data: SupplierFormData): Promise<Supplier> => {
    await delay(800);
    
    const newId = Math.max(...suppliersData.map(s => s.id)) + 1;
    const now = new Date().toISOString();
    
    const newSupplier: Supplier = {
      id: newId,
      ...data,
      totalPurchases: 0,
      outstandingPayable: 0,
      lastOrderDate: now,
      createdAt: now,
      updatedAt: now
    };
    
    suppliersData.push(newSupplier);
    return { ...newSupplier };
  },
  
  // Mettre à jour un fournisseur existant
  update: async (id: number, data: Partial<SupplierFormData>): Promise<Supplier> => {
    await delay(800);
    
    const index = suppliersData.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Fournisseur avec l'ID ${id} non trouvé`);
    }
    
    const updatedSupplier = {
      ...suppliersData[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    suppliersData[index] = updatedSupplier;
    return { ...updatedSupplier };
  },
  
  // Supprimer un fournisseur
  delete: async (id: number): Promise<void> => {
    await delay(500);
    
    const index = suppliersData.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Fournisseur avec l'ID ${id} non trouvé`);
    }
    
    suppliersData.splice(index, 1);
  },
  
  // Ajouter une note à un fournisseur
  addNote: async (supplierId: number, content: string): Promise<SupplierNote> => {
    await delay(300);
    
    const supplier = suppliersData.find(s => s.id === supplierId);
    if (!supplier) {
      throw new Error(`Fournisseur avec l'ID ${supplierId} non trouvé`);
    }
    
    const newNote: SupplierNote = {
      id: supplier.notes ? Math.max(...supplier.notes.map(n => n.id)) + 1 : 1,
      content,
      createdAt: new Date().toISOString(),
      createdBy: 'Utilisateur'
    };
    
    if (!supplier.notes) {
      supplier.notes = [];
    }
    
    supplier.notes.push(newNote);
    return { ...newNote };
  },
  
  // Récupérer les fournisseurs par pays
  getByCountry: async (country: string): Promise<Supplier[]> => {
    await delay(300);
    return suppliersData.filter(s => s.country.toLowerCase() === country.toLowerCase());
  },
  
  // Récupérer les fournisseurs par catégorie
  getByCategory: async (category: string): Promise<Supplier[]> => {
    await delay(300);
    return suppliersData.filter(s => s.category.toLowerCase() === category.toLowerCase());
  },
  
  // Rechercher des fournisseurs
  search: async (query: string): Promise<Supplier[]> => {
    await delay(500);
    
    if (!query) return [...suppliersData];
    
    const lowerQuery = query.toLowerCase();
    return suppliersData.filter(supplier => 
      supplier.name.toLowerCase().includes(lowerQuery) ||
      supplier.email.toLowerCase().includes(lowerQuery) ||
      supplier.country.toLowerCase().includes(lowerQuery) ||
      supplier.category.toLowerCase().includes(lowerQuery) ||
      supplier.city?.toLowerCase().includes(lowerQuery) ||
      supplier.phone.includes(query)
    );
  }
};
