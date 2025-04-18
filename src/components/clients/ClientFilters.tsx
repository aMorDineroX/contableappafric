import React, { useState } from 'react';
import { ClientStatus } from '../../types/client';

interface ClientFiltersProps {
  onFilterChange: (filters: ClientFilters) => void;
  onReset: () => void;
}

export interface ClientFilters {
  status: ClientStatus | 'all';
  country: string;
  hasOutstandingBalance: boolean | 'all';
  sortBy: 'name' | 'lastOrderDate' | 'totalSales' | 'outstandingBalance';
  sortOrder: 'asc' | 'desc';
}

const ClientFilters: React.FC<ClientFiltersProps> = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState<ClientFilters>({
    status: 'all',
    country: '',
    hasOutstandingBalance: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const newFilters = { ...filters, [name]: checked ? true : 'all' };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters: ClientFilters = {
      status: 'all',
      country: '',
      hasOutstandingBalance: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(defaultFilters);
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Réduire' : 'Plus de filtres'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Statut */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="prospect">Prospect</option>
            <option value="archivé">Archivé</option>
          </select>
        </div>

        {/* Pays */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Pays
          </label>
          <select
            id="country"
            name="country"
            value={filters.country}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Tous les pays</option>
            <option value="Bénin">Bénin</option>
            <option value="Burkina Faso">Burkina Faso</option>
            <option value="Cameroun">Cameroun</option>
            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
            <option value="Ghana">Ghana</option>
            <option value="Mali">Mali</option>
            <option value="Niger">Niger</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Sénégal">Sénégal</option>
            <option value="Togo">Togo</option>
          </select>
        </div>

        {/* Tri */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Trier par
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="name">Nom</option>
            <option value="lastOrderDate">Dernière commande</option>
            <option value="totalSales">Ventes totales</option>
            <option value="outstandingBalance">Solde impayé</option>
          </select>
        </div>

        {/* Ordre de tri */}
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Ordre
          </label>
          <select
            id="sortOrder"
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </select>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Solde impayé */}
            <div className="flex items-center">
              <input
                id="hasOutstandingBalance"
                name="hasOutstandingBalance"
                type="checkbox"
                checked={filters.hasOutstandingBalance === true}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasOutstandingBalance" className="ml-2 block text-sm text-gray-700">
                Avec solde impayé
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ClientFilters;
