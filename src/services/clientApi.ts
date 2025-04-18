import { Client, ClientFormData, ClientStatus } from '../types/client';

// Données fictives pour les clients
const clientsData: Client[] = [
  {
    id: 1,
    name: 'Entreprise Alpha',
    email: 'contact@alpha.com',
    phone: '+221 77 123 45 67',
    address: '123 Rue Principale',
    city: 'Dakar',
    postalCode: '10000',
    country: 'Sénégal',
    taxId: 'SN12345678',
    website: 'www.alpha.com',
    totalSales: 1250000,
    outstandingBalance: 350000,
    status: 'actif',
    lastOrderDate: '2023-11-28',
    createdAt: '2022-05-15T10:30:00Z',
    updatedAt: '2023-11-28T14:45:00Z',
    contacts: [
      {
        id: 1,
        name: 'Amadou Diop',
        role: 'Directeur Financier',
        email: 'amadou@alpha.com',
        phone: '+221 77 987 65 43',
        isPrimary: true
      },
      {
        id: 2,
        name: 'Fatou Ndiaye',
        role: 'Responsable Achats',
        email: 'fatou@alpha.com',
        phone: '+221 78 456 78 90',
        isPrimary: false
      }
    ],
    notes: [
      {
        id: 1,
        content: 'Client fidèle depuis 2022. Préfère être contacté par email.',
        createdAt: '2022-05-15T10:35:00Z',
        createdBy: 'Mor Ndiaye'
      }
    ]
  },
  {
    id: 2,
    name: 'Société Beta',
    email: 'info@beta.ci',
    phone: '+225 01 234 56 78',
    address: '45 Boulevard Central',
    city: 'Abidjan',
    postalCode: '01 BP 1234',
    country: 'Côte d\'Ivoire',
    taxId: 'CI87654321',
    website: 'www.beta.ci',
    totalSales: 980000,
    outstandingBalance: 0,
    status: 'actif',
    lastOrderDate: '2023-12-05',
    createdAt: '2022-08-20T09:15:00Z',
    updatedAt: '2023-12-05T16:30:00Z',
    contacts: [
      {
        id: 3,
        name: 'Kouamé Konan',
        role: 'PDG',
        email: 'kouame@beta.ci',
        phone: '+225 07 123 45 67',
        isPrimary: true
      }
    ]
  },
  {
    id: 3,
    name: 'Gamma Industries',
    email: 'service@gamma.ng',
    phone: '+234 801 234 5678',
    address: '78 Main Street',
    city: 'Lagos',
    country: 'Nigeria',
    taxId: 'NG123456789',
    website: 'www.gamma.ng',
    totalSales: 2450000,
    outstandingBalance: 780000,
    status: 'actif',
    lastOrderDate: '2023-12-01',
    createdAt: '2022-03-10T11:20:00Z',
    updatedAt: '2023-12-01T10:15:00Z'
  },
  {
    id: 4,
    name: 'Delta Corporation',
    email: 'contact@delta.cm',
    phone: '+237 6 12 34 56 78',
    address: '56 Avenue Centrale',
    city: 'Douala',
    country: 'Cameroun',
    totalSales: 750000,
    outstandingBalance: 120000,
    status: 'actif',
    lastOrderDate: '2023-11-15',
    createdAt: '2022-09-05T14:30:00Z',
    updatedAt: '2023-11-15T09:45:00Z'
  },
  {
    id: 5,
    name: 'Epsilon SARL',
    email: 'info@epsilon.sn',
    phone: '+221 78 765 43 21',
    address: '89 Rue du Commerce',
    city: 'Dakar',
    country: 'Sénégal',
    totalSales: 320000,
    outstandingBalance: 0,
    status: 'inactif',
    lastOrderDate: '2023-10-20',
    createdAt: '2022-11-15T08:45:00Z',
    updatedAt: '2023-10-20T15:30:00Z'
  },
  {
    id: 6,
    name: 'Zeta Entreprise',
    email: 'contact@zeta.bf',
    phone: '+226 70 12 34 56',
    address: '12 Rue des Marchés',
    city: 'Ouagadougou',
    country: 'Burkina Faso',
    totalSales: 560000,
    outstandingBalance: 230000,
    status: 'actif',
    lastOrderDate: '2023-11-30',
    createdAt: '2023-01-20T10:15:00Z',
    updatedAt: '2023-11-30T11:20:00Z'
  },
  {
    id: 7,
    name: 'Eta Group',
    email: 'info@eta.ml',
    phone: '+223 76 12 34 56',
    address: '34 Avenue de la République',
    city: 'Bamako',
    country: 'Mali',
    totalSales: 890000,
    outstandingBalance: 150000,
    status: 'actif',
    lastOrderDate: '2023-12-03',
    createdAt: '2022-07-12T09:30:00Z',
    updatedAt: '2023-12-03T14:15:00Z'
  },
  {
    id: 8,
    name: 'Theta Compagnie',
    email: 'service@theta.ne',
    phone: '+227 90 12 34 56',
    address: '67 Rue du Sahel',
    city: 'Niamey',
    country: 'Niger',
    totalSales: 420000,
    outstandingBalance: 80000,
    status: 'actif',
    lastOrderDate: '2023-11-25',
    createdAt: '2023-02-18T11:45:00Z',
    updatedAt: '2023-11-25T16:20:00Z'
  },
  {
    id: 9,
    name: 'Iota Entreprises',
    email: 'contact@iota.tg',
    phone: '+228 90 12 34 56',
    address: '23 Boulevard Maritime',
    city: 'Lomé',
    country: 'Togo',
    totalSales: 680000,
    outstandingBalance: 0,
    status: 'inactif',
    lastOrderDate: '2023-09-15',
    createdAt: '2022-10-05T13:20:00Z',
    updatedAt: '2023-09-15T10:30:00Z'
  },
  {
    id: 10,
    name: 'Kappa SA',
    email: 'info@kappa.bj',
    phone: '+229 97 12 34 56',
    address: '45 Rue du Marché',
    city: 'Cotonou',
    country: 'Bénin',
    totalSales: 510000,
    outstandingBalance: 90000,
    status: 'actif',
    lastOrderDate: '2023-12-02',
    createdAt: '2023-03-25T09:15:00Z',
    updatedAt: '2023-12-02T15:45:00Z'
  },
  {
    id: 11,
    name: 'Lambda Technologies',
    email: 'contact@lambda.sn',
    phone: '+221 76 543 21 09',
    address: '56 Avenue de l\'Indépendance',
    city: 'Dakar',
    country: 'Sénégal',
    totalSales: 1850000,
    outstandingBalance: 320000,
    status: 'actif',
    lastOrderDate: '2023-12-04',
    createdAt: '2022-04-15T10:30:00Z',
    updatedAt: '2023-12-04T11:15:00Z'
  },
  {
    id: 12,
    name: 'Omega Consulting',
    email: 'info@omega.gh',
    phone: '+233 24 123 4567',
    address: '78 High Street',
    city: 'Accra',
    country: 'Ghana',
    totalSales: 920000,
    outstandingBalance: 0,
    status: 'prospect',
    lastOrderDate: '2023-11-10',
    createdAt: '2023-05-20T14:45:00Z',
    updatedAt: '2023-11-10T09:30:00Z'
  }
];

// Simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Client
export const ClientAPI = {
  // Récupérer tous les clients
  getAll: async (): Promise<Client[]> => {
    await delay(500);
    return [...clientsData];
  },
  
  // Récupérer un client par son ID
  getById: async (id: number): Promise<Client> => {
    await delay(300);
    const client = clientsData.find(c => c.id === id);
    if (!client) {
      throw new Error(`Client avec l'ID ${id} non trouvé`);
    }
    return { ...client };
  },
  
  // Créer un nouveau client
  create: async (clientData: ClientFormData): Promise<Client> => {
    await delay(800);
    
    const newId = Math.max(...clientsData.map(c => c.id), 0) + 1;
    const now = new Date().toISOString();
    
    const newClient: Client = {
      id: newId,
      ...clientData,
      totalSales: 0,
      outstandingBalance: 0,
      lastOrderDate: now,
      createdAt: now,
      updatedAt: now
    };
    
    clientsData.push(newClient);
    return { ...newClient };
  },
  
  // Mettre à jour un client
  update: async (id: number, clientData: Partial<ClientFormData>): Promise<Client> => {
    await delay(800);
    
    const index = clientsData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Client avec l'ID ${id} non trouvé`);
    }
    
    const updatedClient = {
      ...clientsData[index],
      ...clientData,
      updatedAt: new Date().toISOString()
    };
    
    clientsData[index] = updatedClient;
    return { ...updatedClient };
  },
  
  // Supprimer un client
  delete: async (id: number): Promise<void> => {
    await delay(500);
    
    const index = clientsData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Client avec l'ID ${id} non trouvé`);
    }
    
    clientsData.splice(index, 1);
  },
  
  // Ajouter une note à un client
  addNote: async (clientId: number, content: string): Promise<ClientNote> => {
    await delay(300);
    
    const client = clientsData.find(c => c.id === clientId);
    if (!client) {
      throw new Error(`Client avec l'ID ${clientId} non trouvé`);
    }
    
    const newNote: ClientNote = {
      id: Math.max(...(client.notes?.map(n => n.id) || [0]), 0) + 1,
      content,
      createdAt: new Date().toISOString(),
      createdBy: 'Utilisateur actuel' // À remplacer par l'utilisateur réel
    };
    
    if (!client.notes) {
      client.notes = [];
    }
    
    client.notes.push(newNote);
    return { ...newNote };
  },
  
  // Récupérer les clients par statut
  getByStatus: async (status: ClientStatus): Promise<Client[]> => {
    await delay(300);
    return clientsData.filter(c => c.status === status);
  },
  
  // Récupérer les clients par pays
  getByCountry: async (country: string): Promise<Client[]> => {
    await delay(300);
    return clientsData.filter(c => c.country.toLowerCase() === country.toLowerCase());
  },
  
  // Rechercher des clients
  search: async (query: string): Promise<Client[]> => {
    await delay(500);
    
    if (!query) return [...clientsData];
    
    const lowerQuery = query.toLowerCase();
    return clientsData.filter(client => 
      client.name.toLowerCase().includes(lowerQuery) ||
      client.email.toLowerCase().includes(lowerQuery) ||
      client.country.toLowerCase().includes(lowerQuery) ||
      client.city?.toLowerCase().includes(lowerQuery) ||
      client.phone.includes(query)
    );
  }
};
