import React from 'react';
import { Client } from '../../types/client';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';

interface ClientTableProps {
  clients: Client[];
  onClientClick: (client: Client) => void;
  selectedClientIds?: number[];
  onClientSelect?: (clientId: number, isSelected: boolean) => void;
  selectionMode?: boolean;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  onClientClick,
  selectedClientIds = [],
  onClientSelect,
  selectionMode = false
}) => {
  const { currency } = useCurrency();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleRowClick = (client: Client) => {
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
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectionMode && (
                <th scope="col" className="px-4 py-3 w-10">
                  <span className="sr-only">Sélectionner</span>
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pays
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ventes totales
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solde impayé
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière commande
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr
                key={client.id}
                className={`hover:bg-gray-50 cursor-pointer ${selectedClientIds.includes(client.id) ? 'bg-blue-50' : ''}`}
                onClick={() => handleRowClick(client)}
              >
                {selectionMode && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedClientIds.includes(client.id)}
                        onChange={() => {}}
                        onClick={(e) => handleCheckboxClick(e, client.id)}
                      />
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.email}</div>
                  <div className="text-sm text-gray-500">{client.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-medium">
                  {formatCurrency(client.totalSales, currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  <span className={client.outstandingBalance > 0 ? 'text-amber-600' : 'text-green-600'}>
                    {formatCurrency(client.outstandingBalance, currency)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(client.lastOrderDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
