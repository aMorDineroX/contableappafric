import React, { useState } from 'react';
import { Client, ClientNote } from '../../types/client';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';

interface ClientDetailsProps {
  client: Client;
  onEdit: () => void;
  onClose: () => void;
  onAddNote?: (content: string) => Promise<void>;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({
  client,
  onEdit,
  onClose,
  onAddNote
}) => {
  const { currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'info' | 'transactions' | 'notes' | 'documents'>('info');
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !onAddNote) return;
    
    setIsAddingNote(true);
    try {
      await onAddNote(newNote);
      setNewNote('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* En-tête */}
      <div className="p-6 bg-blue-50 border-b border-blue-100">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
              <span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
                client.status === 'actif' 
                  ? 'bg-green-100 text-green-800' 
                  : client.status === 'prospect'
                  ? 'bg-blue-100 text-blue-800'
                  : client.status === 'inactif'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {client.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{client.email} • {client.phone}</p>
            <p className="text-sm text-gray-500 mt-1">
              {client.address}{client.city ? `, ${client.city}` : ''}{client.postalCode ? ` ${client.postalCode}` : ''}, {client.country}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
              title="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-md p-4 shadow-sm">
            <p className="text-sm text-gray-500">Ventes totales</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(client.totalSales, currency)}
            </p>
          </div>
          <div className="bg-white rounded-md p-4 shadow-sm">
            <p className="text-sm text-gray-500">Solde impayé</p>
            <p className={`text-xl font-bold ${client.outstandingBalance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              {formatCurrency(client.outstandingBalance, currency)}
            </p>
          </div>
          <div className="bg-white rounded-md p-4 shadow-sm">
            <p className="text-sm text-gray-500">Dernière commande</p>
            <p className="text-xl font-bold text-gray-900">
              {formatDate(client.lastOrderDate)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'info'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'transactions'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-4 px-6 text-sm font-medium flex items-center ${
              activeTab === 'notes'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Notes
            {client.notes && client.notes.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                {client.notes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-6 text-sm font-medium flex items-center ${
              activeTab === 'documents'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
            {client.documents && client.documents.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                {client.documents.length}
              </span>
            )}
          </button>
        </nav>
      </div>
      
      {/* Contenu des onglets */}
      <div className="p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="text-base font-medium text-gray-900">{client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-base font-medium text-gray-900">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="text-base font-medium text-gray-900">{client.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Site web</p>
                  <p className="text-base font-medium text-gray-900">
                    {client.website ? (
                      <a 
                        href={client.website.startsWith('http') ? client.website : `https://${client.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {client.website}
                      </a>
                    ) : (
                      'Non spécifié'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Numéro fiscal</p>
                  <p className="text-base font-medium text-gray-900">
                    {client.taxId || 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="text-base font-medium">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'actif' 
                        ? 'bg-green-100 text-green-800' 
                        : client.status === 'prospect'
                        ? 'bg-blue-100 text-blue-800'
                        : client.status === 'inactif'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Adresse complète</p>
                  <p className="text-base font-medium text-gray-900">
                    {client.address}
                    {client.city ? `, ${client.city}` : ''}
                    {client.postalCode ? ` ${client.postalCode}` : ''}
                    {client.country ? `, ${client.country}` : ''}
                  </p>
                </div>
              </div>
            </div>
            
            {client.contacts && client.contacts.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contacts</h3>
                <div className="space-y-4">
                  {client.contacts.map(contact => (
                    <div key={contact.id} className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-500">{contact.role}</p>
                        </div>
                        {contact.isPrimary && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Contact principal
                          </span>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p className="text-sm">
                          <span className="text-gray-500">Email:</span>{' '}
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                            {contact.email}
                          </a>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Téléphone:</span>{' '}
                          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
                            {contact.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Client depuis {formatDate(client.createdAt)}</span>
                <span>Dernière mise à jour le {formatDate(client.updatedAt)}</span>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'transactions' && (
          <div>
            {client.transactions && client.transactions.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
                  <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md hover:bg-blue-50">
                    Nouvelle transaction
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {client.transactions.map(transaction => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.type === 'REVENU' ? 'Revenu' : 'Dépense'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                            transaction.type === 'REVENU' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'VALIDEE' 
                                ? 'bg-green-100 text-green-800' 
                                : transaction.status === 'EN_ATTENTE'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status === 'VALIDEE' 
                                ? 'Validée' 
                                : transaction.status === 'EN_ATTENTE'
                                ? 'En attente'
                                : 'Annulée'
                              }
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune transaction</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ce client n'a pas encore de transactions.
                </p>
                <div className="mt-6">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nouvelle transaction
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Notes</h3>
            </div>
            
            <div className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une nouvelle note..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || isAddingNote}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    !newNote.trim() || isAddingNote ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isAddingNote ? 'Ajout en cours...' : 'Ajouter une note'}
                </button>
              </div>
            </div>
            
            {client.notes && client.notes.length > 0 ? (
              <div className="space-y-4">
                {client.notes.map((note: ClientNote) => (
                  <div key={note.id} className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-900">{note.content}</p>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>{note.createdBy}</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune note</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par ajouter une note pour ce client.
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Documents</h3>
              <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md hover:bg-blue-50">
                Ajouter un document
              </button>
            </div>
            
            {client.documents && client.documents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {client.documents.map(doc => (
                  <li key={doc.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="flex-shrink-0 h-5 w-5 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.size / 1024).toFixed(2)} Ko • Ajouté le {formatDate(doc.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-3 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      Télécharger
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par ajouter un document pour ce client.
                </p>
                <div className="mt-6">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Ajouter un document
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
