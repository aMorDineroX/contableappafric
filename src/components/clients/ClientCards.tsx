import React from 'react';
import { Client } from '../../types/client';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';

interface ClientCardsProps {
  clients: Client[];
  onClientClick: (client: Client) => void;
  selectedClientIds?: number[];
  onClientSelect?: (clientId: number, isSelected: boolean) => void;
  selectionMode?: boolean;
}

const ClientCards: React.FC<ClientCardsProps> = ({
  clients,
  onClientClick,
  selectedClientIds = [],
  onClientSelect,
  selectionMode = false
}) => {
  const { currency } = useCurrency();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCardClick = (client: Client) => {
    if (selectionMode && onClientSelect) {
      onClientSelect(client.id, !selectedClientIds.includes(client.id));
    } else {
      onClientClick(client);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent, clientId: number) => {
    e.stopPropagation();
    if (onClientSelect) {
      onClientSelect(clientId, !selectedClientIds.includes(clientId));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clients.map((client) => (
        <div
          key={client.id}
          className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] cursor-pointer ${selectedClientIds.includes(client.id) ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleCardClick(client)}
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {selectionMode && (
                  <div
                    onClick={(e) => handleCheckboxClick(e, client.id)}
                    className="relative flex items-center"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedClientIds.includes(client.id)}
                      onChange={() => {}}
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-800 truncate">{client.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                client.status === 'actif'
                  ? 'bg-green-100 text-green-800'
                  : client.status === 'prospect'
                  ? 'bg-blue-100 text-blue-800'
                  : client.status === 'inactif'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {client.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {client.email}
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {client.phone}
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {client.country}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
              <div>
                <p className="text-xs text-gray-500">Total des ventes</p>
                <p className="font-semibold text-blue-600">{formatCurrency(client.totalSales, currency)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Solde impayé</p>
                <p className={`font-semibold ${client.outstandingBalance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {formatCurrency(client.outstandingBalance, currency)}
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Dernière commande: {formatDate(client.lastOrderDate)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientCards;
