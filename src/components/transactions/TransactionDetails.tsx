import React, { useState } from 'react';
import { Transaction, Attachment } from '../../types/transaction';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';
import { TransactionAPI } from '../../services/api';

interface TransactionDetailsProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  onEdit,
  onDelete,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'attachments'>('details');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<Record<number, boolean>>({});

  const handleDownloadAttachment = async (attachment: Attachment) => {
    try {
      setIsDownloading(prev => ({ ...prev, [attachment.id]: true }));

      // Normalement, on ferait un appel API pour télécharger le fichier
      // Mais pour cet exemple, on simule juste un téléchargement

      // Simuler un délai de téléchargement
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setIsDownloading(prev => ({ ...prev, [attachment.id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} octets`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} Ko`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} Mo`;
    }
  };

  const getFileIcon = (fileName: string): JSX.Element => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    let iconPath = '';

    switch (extension) {
      case 'pdf':
        iconPath = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
        break;
      case 'doc':
      case 'docx':
        iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v10H6V3h7z';
        break;
      case 'xls':
      case 'xlsx':
        iconPath = 'M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2z';
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        iconPath = 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zM8 10l3 3 2-2 3 3H8v-4z';
        break;
      default:
        iconPath = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z';
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={iconPath}
        />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
      {/* En-tête */}
      <div className={`p-6 ${transaction.type === 'REVENU' ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{transaction.description}</h2>
            <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
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
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
              title="Supprimer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        <div className="mt-4">
          <p className={`text-3xl font-bold ${transaction.type === 'REVENU' ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(transaction.amount, transaction.currency)}
          </p>
          <div className="mt-2 flex items-center">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
            {transaction.category && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {transaction.category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'details'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Détails
          </button>
          <button
            onClick={() => setActiveTab('attachments')}
            className={`py-4 px-6 text-sm font-medium flex items-center ${
              activeTab === 'attachments'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pièces jointes
            {transaction.attachments && transaction.attachments.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                {transaction.attachments.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="p-6">
        {activeTab === 'details' ? (
          <div className="space-y-4">
            {/* Informations de base */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {transaction.type === 'REVENU' ? 'Revenu' : 'Dépense'}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(transaction.date)}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {transaction.category ? transaction.category.name : 'Non catégorisé'}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {transaction.reference || 'Aucune référence'}
                </p>
              </div>
            </div>

            {/* Tags */}
            {transaction.tags && transaction.tags.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {transaction.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                      style={tag.color ? {
                        backgroundColor: `${tag.color}20`,
                        color: tag.color
                      } : undefined}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {transaction.notes && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Notes</h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                  {transaction.notes}
                </div>
              </div>
            )}

            {/* Dates de création/modification */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Créé le {formatDate(transaction.createdAt)}</span>
                <span>Dernière modification le {formatDate(transaction.updatedAt)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {transaction.attachments && transaction.attachments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {transaction.attachments.map(attachment => (
                  <li key={attachment.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(attachment.fileName)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{attachment.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachment.fileSize)} • Ajouté le {formatDate(attachment.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadAttachment(attachment)}
                      disabled={isDownloading[attachment.id]}
                      className={`ml-4 px-3 py-1 text-xs font-medium rounded-md ${
                        isDownloading[attachment.id]
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {isDownloading[attachment.id] ? 'Téléchargement...' : 'Télécharger'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune pièce jointe</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Cette transaction ne contient pas de pièces jointes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  onDelete();
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
