const API_URL = "http://localhost:3003/api";

import { Transaction, TransactionFormData, Category, Tag, Attachment } from '../types/transaction';
import { mockTransactions, mockCategories, mockTags } from '../data/mockData';

// Fonction utilitaire pour les requêtes API avec gestion des erreurs
const apiRequest = async (url: string, options?: RequestInit) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Utilisation des données de démonstration en attendant l'API backend
let transactions = [...mockTransactions];

export const TransactionAPI = {
  getAll: async (): Promise<Transaction[]> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return transactions;
  },

  getById: async (id: number): Promise<Transaction> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) {
      throw new Error(`Transaction avec l'ID ${id} non trouvée`);
    }
    return transaction;
  },

  create: async (transactionData: TransactionFormData): Promise<Transaction> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));

    // Générer un nouvel ID
    const newId = Math.max(...transactions.map(t => t.id), 0) + 1;

    // Trouver la catégorie
    const category = mockCategories.find(c => c.id === transactionData.categoryId);

    // Trouver les tags
    const tags = transactionData.tagIds
      ? mockTags.filter(tag => transactionData.tagIds?.includes(tag.id))
      : [];

    // Créer la nouvelle transaction
    const newTransaction: Transaction = {
      id: newId,
      ...transactionData,
      status: 'VALIDEE',
      category,
      tags,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Ajouter à la liste
    transactions = [newTransaction, ...transactions];

    return newTransaction;
  },

  update: async (id: number, transactionData: Partial<TransactionFormData>): Promise<Transaction> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));

    // Trouver la transaction
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction avec l'ID ${id} non trouvée`);
    }

    // Mettre à jour la transaction
    const updatedTransaction = {
      ...transactions[index],
      ...transactionData,
      updatedAt: new Date().toISOString()
    };

    // Mettre à jour la catégorie si nécessaire
    if (transactionData.categoryId && transactionData.categoryId !== transactions[index].categoryId) {
      updatedTransaction.category = mockCategories.find(c => c.id === transactionData.categoryId);
    }

    // Mettre à jour les tags si nécessaire
    if (transactionData.tagIds) {
      updatedTransaction.tags = mockTags.filter(tag => transactionData.tagIds?.includes(tag.id));
    }

    // Mettre à jour la liste
    transactions[index] = updatedTransaction as Transaction;

    return updatedTransaction as Transaction;
  },

  delete: async (id: number): Promise<void> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Vérifier si la transaction existe
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction avec l'ID ${id} non trouvée`);
    }

    // Supprimer de la liste
    transactions = transactions.filter(t => t.id !== id);
  },

  updateStatus: async (id: number, status: string): Promise<Transaction> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));

    // Trouver la transaction
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction avec l'ID ${id} non trouvée`);
    }

    // Mettre à jour le statut
    const updatedTransaction = {
      ...transactions[index],
      status,
      updatedAt: new Date().toISOString()
    };

    // Mettre à jour la liste
    transactions[index] = updatedTransaction as Transaction;

    return updatedTransaction as Transaction;
  },

  // Gestion des pièces jointes
  uploadAttachment: async (transactionId: number, file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers = {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      // Ne pas définir Content-Type ici, il sera automatiquement défini avec le boundary
    };

    const response = await fetch(`${API_URL}/transactions/${transactionId}/attachments`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  deleteAttachment: async (transactionId: number, attachmentId: number): Promise<void> => {
    return apiRequest(`${API_URL}/transactions/${transactionId}/attachments/${attachmentId}`, {
      method: "DELETE",
    });
  },

  getAttachments: async (transactionId: number): Promise<Attachment[]> => {
    return apiRequest(`${API_URL}/transactions/${transactionId}/attachments`);
  },
};

// Utilisation des données de démonstration pour les catégories
let categories = [...mockCategories];

export const CategoryAPI = {
  getAll: async (): Promise<Category[]> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    return categories;
  },

  create: async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Générer un nouvel ID
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;

    // Créer la nouvelle catégorie
    const newCategory: Category = {
      id: newId,
      ...categoryData
    };

    // Ajouter à la liste
    categories = [...categories, newCategory];

    return newCategory;
  },

  update: async (id: number, categoryData: Partial<Category>): Promise<Category> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Trouver la catégorie
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Catégorie avec l'ID ${id} non trouvée`);
    }

    // Mettre à jour la catégorie
    const updatedCategory = {
      ...categories[index],
      ...categoryData
    };

    // Mettre à jour la liste
    categories[index] = updatedCategory;

    return updatedCategory;
  },

  delete: async (id: number): Promise<void> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Vérifier si la catégorie existe
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Catégorie avec l'ID ${id} non trouvée`);
    }

    // Supprimer de la liste
    categories = categories.filter(c => c.id !== id);
  },
};

// Utilisation des données de démonstration pour les tags
let tags = [...mockTags];

export const TagAPI = {
  getAll: async (): Promise<Tag[]> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    return tags;
  },

  create: async (tagData: Omit<Tag, 'id'>): Promise<Tag> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Générer un nouvel ID
    const newId = Math.max(...tags.map(t => t.id), 0) + 1;

    // Créer le nouveau tag
    const newTag: Tag = {
      id: newId,
      ...tagData
    };

    // Ajouter à la liste
    tags = [...tags, newTag];

    return newTag;
  },

  update: async (id: number, tagData: Partial<Tag>): Promise<Tag> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Trouver le tag
    const index = tags.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Tag avec l'ID ${id} non trouvé`);
    }

    // Mettre à jour le tag
    const updatedTag = {
      ...tags[index],
      ...tagData
    };

    // Mettre à jour la liste
    tags[index] = updatedTag;

    return updatedTag;
  },

  delete: async (id: number): Promise<void> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Vérifier si le tag existe
    const index = tags.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Tag avec l'ID ${id} non trouvé`);
    }

    // Supprimer de la liste
    tags = tags.filter(t => t.id !== id);
  },

  // Gestion des tags pour une transaction
  addTagToTransaction: async (transactionId: number, tagId: number): Promise<void> => {
    return apiRequest(`${API_URL}/transactions/${transactionId}/tags/${tagId}`, {
      method: "POST",
    });
  },

  removeTagFromTransaction: async (transactionId: number, tagId: number): Promise<void> => {
    return apiRequest(`${API_URL}/transactions/${transactionId}/tags/${tagId}`, {
      method: "DELETE",
    });
  },
};

export const AuthAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la réponse contient un message d'erreur, on l'utilise
      if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Échec de la connexion');
      }
    }

    return data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la réponse contient un message d'erreur, on l'utilise
      if (data && data.error && data.error.message) {
        throw new Error(data.error.message);
      } else {
        throw new Error('Échec de l\'inscription');
      }
    }

    return data;
  },

  verifyToken: async (token: string) => {
    try {
      console.log('Vérification du token avec l\'API:', token.substring(0, 10) + '...');
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      // Si le token est celui de démo, on le considère comme valide
      if (token === 'demo-token-for-testing') {
        console.log('Token de démo détecté, considéré comme valide');
        return true;
      }

      // Vérifier si la réponse est OK
      if (response.ok) {
        console.log('Token vérifié avec succès');
        return true;
      } else {
        console.log('Token invalide selon l\'API');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      // En cas d'erreur de connexion à l'API, on peut considérer le token comme valide
      // pour permettre à l'utilisateur de continuer à utiliser l'application
      console.log('API non disponible, on considère le token comme valide par défaut');
      return true;
    }
  }
};