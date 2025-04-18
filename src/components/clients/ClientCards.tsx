import React from 'react';
import { Client } from '../../types/client';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';

interface ClientCardsProps {
  clients: Client[];
  onClientClick: (client: Client) => void;
}

const ClientCards: React.FC<ClientCardsProps> = ({ clients, onClientClick }) => {
  const { currency } = useCurrency();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clients.map((client) => (
        <div
          key={client.id}
          className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onClientClick(client)}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">{client.name}</h3>
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
            </div>
            <p className="text-sm text-gray-500 mb-1">{client.email}</p>
            <p className="text-sm text-gray-500 mb-1">{client.phone}</p>
            <p className="text-sm text-gray-500 mb-4">{client.country}</p>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Solde impayé</span>
                <span className={`font-medium ${
                  client.outstandingBalance > 0 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {formatCurrency(client.outstandingBalance, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">Ventes totales</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(client.totalSales, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientCards;
