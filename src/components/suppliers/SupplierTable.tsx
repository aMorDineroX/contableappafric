import React from 'react';
import { Supplier } from '../../types/supplier';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';

interface SupplierTableProps {
  suppliers: Supplier[];
  onSupplierClick: (supplier: Supplier) => void;
  selectedSupplierIds?: number[];
  onSupplierSelect?: (supplierId: number, isSelected: boolean) => void;
  selectionMode?: boolean;
}

const SupplierTable: React.FC<SupplierTableProps> = ({ 
  suppliers, 
  onSupplierClick, 
  selectedSupplierIds = [], 
  onSupplierSelect, 
  selectionMode = false 
}) => {
  const { currency } = useCurrency();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  const handleRowClick = (supplier: Supplier) => {
    if (selectionMode && onSupplierSelect) {
      onSupplierSelect(supplier.id, !selectedSupplierIds.includes(supplier.id));
    } else {
      onSupplierClick(supplier);
    }
  };
  
  const handleCheckboxClick = (e: React.MouseEvent, supplierId: number) => {
    e.stopPropagation();
    if (onSupplierSelect) {
      onSupplierSelect(supplierId, !selectedSupplierIds.includes(supplierId));
    }
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                Catégorie
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pays
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Achats totaux
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                À payer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière commande
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr 
                key={supplier.id} 
                className={`hover:bg-gray-50 cursor-pointer ${selectedSupplierIds.includes(supplier.id) ? 'bg-blue-50' : ''}`}
                onClick={() => handleRowClick(supplier)}
              >
                {selectionMode && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedSupplierIds.includes(supplier.id)}
                        onChange={() => {}}
                        onClick={(e) => handleCheckboxClick(e, supplier.id)}
                      />
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{supplier.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{supplier.country}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatCurrency(supplier.totalPurchases, currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className={supplier.outstandingPayable > 0 ? 'text-amber-600 font-medium' : 'text-green-600'}>
                    {formatCurrency(supplier.outstandingPayable, currency)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(supplier.lastOrderDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    supplier.status === 'actif' 
                      ? 'bg-green-100 text-green-800' 
                      : supplier.status === 'inactif'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {supplier.status}
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

export default SupplierTable;
