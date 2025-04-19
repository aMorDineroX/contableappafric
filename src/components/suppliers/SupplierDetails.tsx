import React, { useState } from 'react';
import { Supplier, SupplierStatus } from '../../types/supplier';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';

interface SupplierDetailsProps {
  supplier: Supplier;
  onEdit: () => void;
  onClose: () => void;
  onAddNote?: (content: string) => Promise<void>;
  onDelete?: (supplierId: number) => Promise<void>;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({
  supplier,
  onEdit,
  onClose,
  onAddNote,
  onDelete
}) => {
  const { currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'info' | 'notes' | 'documents'>('info');
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !onAddNote) return;
    
    setIsSubmittingNote(true);
    try {
      await onAddNote(newNote);
      setNewNote('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{supplier.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{supplier.category}</p>
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
              {onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
                      onDelete(supplier.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
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
          
          <div className="flex space-x-1 mt-4 border-b">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('info')}
            >
              Informations
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Coordonnées</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium">{supplier.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="text-sm font-medium">{supplier.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="text-sm font-medium">{supplier.address}</p>
                      <p className="text-sm font-medium">
                        {supplier.city && `${supplier.city}, `}{supplier.country}
                      </p>
                    </div>
                    {supplier.website && (
                      <div>
                        <p className="text-sm text-gray-500">Site web</p>
                        <a 
                          href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {supplier.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informations financières</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Total des achats</p>
                      <p className="text-sm font-medium text-blue-600">
                        {formatCurrency(supplier.totalPurchases, currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Montant à payer</p>
                      <p className={`text-sm font-medium ${supplier.outstandingPayable > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                        {formatCurrency(supplier.outstandingPayable, currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dernière commande</p>
                      <p className="text-sm font-medium">{formatDate(supplier.lastOrderDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        supplier.status === 'actif' 
                          ? 'bg-green-100 text-green-800' 
                          : supplier.status === 'inactif'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {supplier.status}
                      </span>
                    </div>
                    {supplier.taxId && (
                      <div>
                        <p className="text-sm text-gray-500">Numéro fiscal</p>
                        <p className="text-sm font-medium">{supplier.taxId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations supplémentaires</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Catégorie</p>
                    <p className="text-sm font-medium">{supplier.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de création</p>
                    <p className="text-sm font-medium">{formatDate(supplier.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dernière mise à jour</p>
                    <p className="text-sm font-medium">{formatDate(supplier.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
              
              {onAddNote && (
                <div className="mb-6">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ajouter une nouvelle note..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={handleAddNote}
                      disabled={isSubmittingNote || !newNote.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isSubmittingNote ? 'Ajout en cours...' : 'Ajouter une note'}
                    </button>
                  </div>
                </div>
              )}
              
              {supplier.notes && supplier.notes.length > 0 ? (
                <div className="space-y-4">
                  {supplier.notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>{note.createdBy}</span>
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucune note disponible</p>
              )}
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
              
              <div className="mb-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Ajouter un document
                </button>
              </div>
              
              {supplier.documents && supplier.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supplier.documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex items-center">
                      <div className="bg-gray-100 p-2 rounded-md mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(doc.uploadDate)} • {(doc.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucun document disponible</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
