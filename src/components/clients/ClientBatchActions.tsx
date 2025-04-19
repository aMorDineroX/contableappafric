import React, { useState } from 'react';
import { ClientStatus } from '../../types/client';

interface ClientBatchActionsProps {
  selectedCount: number;
  onBatchDelete: () => void;
  onBatchStatusChange: (status: ClientStatus) => void;
  onClearSelection: () => void;
}

const ClientBatchActions: React.FC<ClientBatchActionsProps> = ({
  selectedCount,
  onBatchDelete,
  onBatchStatusChange,
  onClearSelection
}) => {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-4">
            {selectedCount} client{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-gray-500 hover:text-gray-700 mr-4"
          >
            Annuler la sélection
          </button>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <button
              onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <span>Changer le statut</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-2 h-4 w-4 transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isStatusMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48">
                <button
                  onClick={() => {
                    onBatchStatusChange('actif');
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Actif
                </button>
                <button
                  onClick={() => {
                    onBatchStatusChange('inactif');
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  Inactif
                </button>
                <button
                  onClick={() => {
                    onBatchStatusChange('prospect');
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  Prospect
                </button>
                <button
                  onClick={() => {
                    onBatchStatusChange('archivé');
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                  Archivé
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCount} client${selectedCount > 1 ? 's' : ''} ?`)) {
                onBatchDelete();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientBatchActions;
