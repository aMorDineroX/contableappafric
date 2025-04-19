import React, { useState, useEffect } from 'react';
import { PaymentStatus, MobilePaymentProvider, AfricanCountry, PaymentDirection, PaymentFilters } from '../../types/payment';
import { MobilePaymentAPI } from '../../services/mobilePaymentApi';

// Noms des fournisseurs de paiement
const providerNames: Record<MobilePaymentProvider, string> = {
  [MobilePaymentProvider.ORANGE_MONEY]: 'Orange Money',
  [MobilePaymentProvider.MTN_MOBILE_MONEY]: 'MTN Mobile Money',
  [MobilePaymentProvider.WAVE]: 'Wave',
  [MobilePaymentProvider.MPESA]: 'M-Pesa',
  [MobilePaymentProvider.MOOV_MONEY]: 'Moov Money',
  [MobilePaymentProvider.FREE_MONEY]: 'Free Money',
};

// Noms des pays
const countryNames: Record<AfricanCountry, string> = {
  [AfricanCountry.SENEGAL]: 'Sénégal',
  [AfricanCountry.COTE_DIVOIRE]: 'Côte d\'Ivoire',
  [AfricanCountry.CAMEROUN]: 'Cameroun',
  [AfricanCountry.MALI]: 'Mali',
  [AfricanCountry.BURKINA_FASO]: 'Burkina Faso',
  [AfricanCountry.BENIN]: 'Bénin',
  [AfricanCountry.TOGO]: 'Togo',
  [AfricanCountry.NIGER]: 'Niger',
  [AfricanCountry.GUINEE]: 'Guinée',
  [AfricanCountry.KENYA]: 'Kenya',
  [AfricanCountry.GHANA]: 'Ghana',
  [AfricanCountry.NIGERIA]: 'Nigeria',
};

// Noms des statuts
const statusNames: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'En attente',
  [PaymentStatus.INITIATED]: 'Initié',
  [PaymentStatus.PROCESSING]: 'En cours',
  [PaymentStatus.COMPLETED]: 'Complété',
  [PaymentStatus.FAILED]: 'Échoué',
  [PaymentStatus.CANCELLED]: 'Annulé',
  [PaymentStatus.REFUNDED]: 'Remboursé',
};

// Noms des directions
const directionNames: Record<PaymentDirection, string> = {
  [PaymentDirection.INBOUND]: 'Reçu',
  [PaymentDirection.OUTBOUND]: 'Envoyé',
};

interface PaymentFiltersProps {
  onFilterChange: (filters: PaymentFilters) => void;
  initialFilters?: PaymentFilters;
  className?: string;
}

const PaymentFiltersComponent: React.FC<PaymentFiltersProps> = ({
  onFilterChange,
  initialFilters = {},
  className = '',
}) => {
  const [filters, setFilters] = useState<PaymentFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [supportedCountries, setSupportedCountries] = useState<AfricanCountry[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);

  // Charger les pays supportés
  useEffect(() => {
    const fetchSupportedCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const countries = await MobilePaymentAPI.getSupportedCountries();
        setSupportedCountries(countries);
      } catch (error) {
        console.error('Erreur lors du chargement des pays:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchSupportedCountries();
  }, []);

  // Mettre à jour les filtres et notifier le parent
  const updateFilters = (newFilters: Partial<PaymentFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
        >
          {isExpanded ? 'Réduire' : 'Afficher plus'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Période */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label htmlFor="startDate" className="sr-only">Date de début</label>
              <input
                type="date"
                id="startDate"
                value={filters.startDate || ''}
                onChange={(e) => updateFilters({ startDate: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="sr-only">Date de fin</label>
              <input
                type="date"
                id="endDate"
                value={filters.endDate || ''}
                onChange={(e) => updateFilters({ endDate: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Statut */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            id="status"
            value={filters.status || ''}
            onChange={(e) => updateFilters({ status: e.target.value as PaymentStatus || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(statusNames).map(([status, name]) => (
              <option key={status} value={status}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Direction */}
        <div>
          <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
          <select
            id="direction"
            value={filters.direction || ''}
            onChange={(e) => updateFilters({ direction: e.target.value as PaymentDirection || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les directions</option>
            {Object.entries(directionNames).map(([direction, name]) => (
              <option key={direction} value={direction}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtres supplémentaires (affichés uniquement si isExpanded est true) */}
        {isExpanded && (
          <>
            {/* Fournisseur */}
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select
                id="provider"
                value={filters.provider || ''}
                onChange={(e) => updateFilters({ provider: e.target.value as MobilePaymentProvider || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les fournisseurs</option>
                {Object.entries(providerNames).map(([provider, name]) => (
                  <option key={provider} value={provider}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pays */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
              <select
                id="country"
                value={filters.country || ''}
                onChange={(e) => updateFilters({ country: e.target.value as AfricanCountry || undefined })}
                disabled={isLoadingCountries}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les pays</option>
                {isLoadingCountries ? (
                  <option value="" disabled>Chargement des pays...</option>
                ) : (
                  supportedCountries.map((country) => (
                    <option key={country} value={country}>
                      {countryNames[country]}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label htmlFor="minAmount" className="sr-only">Montant minimum</label>
                  <input
                    type="number"
                    id="minAmount"
                    placeholder="Min"
                    value={filters.minAmount || ''}
                    onChange={(e) => updateFilters({ minAmount: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="maxAmount" className="sr-only">Montant maximum</label>
                  <input
                    type="number"
                    id="maxAmount"
                    placeholder="Max"
                    value={filters.maxAmount || ''}
                    onChange={(e) => updateFilters({ maxAmount: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Référence */}
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
              <input
                type="text"
                id="reference"
                placeholder="Rechercher par référence"
                value={filters.reference || ''}
                onChange={(e) => updateFilters({ reference: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Numéro de téléphone */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="Ex: +221771234567"
                value={filters.phoneNumber || ''}
                onChange={(e) => updateFilters({ phoneNumber: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Réinitialiser
          </button>
          <button
            onClick={() => onFilterChange(filters)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFiltersComponent;
