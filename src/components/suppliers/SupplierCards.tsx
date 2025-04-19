import React from 'react';
import { Supplier } from '../../types/supplier';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';

interface SupplierCardsProps {
  suppliers: Supplier[];
  onSupplierClick: (supplier: Supplier) => void;
  selectedSupplierIds?: number[];
  onSupplierSelect?: (supplierId: number, isSelected: boolean) => void;
  selectionMode?: boolean;
}

const SupplierCards: React.FC<SupplierCardsProps> = ({ 
  suppliers, 
  onSupplierClick, 
  selectedSupplierIds = [], 
  onSupplierSelect, 
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
  
  const handleCardClick = (supplier: Supplier) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {suppliers.map((supplier) => (
        <div
          key={supplier.id}
          className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] cursor-pointer ${selectedSupplierIds.includes(supplier.id) ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleCardClick(supplier)}
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {selectionMode && (
                  <div 
                    onClick={(e) => handleCheckboxClick(e, supplier.id)}
                    className="relative flex items-center"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedSupplierIds.includes(supplier.id)}
                      onChange={() => {}}
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-800 truncate">{supplier.name}</h3>
              </div>
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
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {supplier.email}
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {supplier.phone}
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {supplier.country}
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {supplier.category}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
              <div>
                <p className="text-xs text-gray-500">Total des achats</p>
                <p className="font-semibold text-blue-600">{formatCurrency(supplier.totalPurchases, currency)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">À payer</p>
                <p className={`font-semibold ${supplier.outstandingPayable > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {formatCurrency(supplier.outstandingPayable, currency)}
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Dernière commande: {formatDate(supplier.lastOrderDate)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupplierCards;
