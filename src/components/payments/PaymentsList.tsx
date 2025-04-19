import React, { useState, useEffect } from 'react';
import { Payment, PaymentStatus, MobilePaymentProvider, AfricanCountry, PaymentDirection, PaymentFilters } from '../../types/payment';
import { MobilePaymentAPI } from '../../services/mobilePaymentApi';
import { formatCurrency } from '../../utils/currencies';
import { useCurrency } from '../../contexts/CurrencyContext';

// Noms des fournisseurs de paiement
const providerNames: Record<MobilePaymentProvider, string> = {
  [MobilePaymentProvider.ORANGE_MONEY]: 'Orange Money',
  [MobilePaymentProvider.MTN_MOBILE_MONEY]: 'MTN Mobile Money',
  [MobilePaymentProvider.WAVE]: 'Wave',
  [MobilePaymentProvider.MPESA]: 'M-Pesa',
  [MobilePaymentProvider.MOOV_MONEY]: 'Moov Money',
  [MobilePaymentProvider.FREE_MONEY]: 'Free Money',
};

// Couleurs et libellés des statuts de paiement
const statusConfig: Record<PaymentStatus, { color: string; label: string }> = {
  [PaymentStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
  [PaymentStatus.INITIATED]: { color: 'bg-blue-100 text-blue-800', label: 'Initié' },
  [PaymentStatus.PROCESSING]: { color: 'bg-purple-100 text-purple-800', label: 'En cours' },
  [PaymentStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', label: 'Complété' },
  [PaymentStatus.FAILED]: { color: 'bg-red-100 text-red-800', label: 'Échoué' },
  [PaymentStatus.CANCELLED]: { color: 'bg-gray-100 text-gray-800', label: 'Annulé' },
  [PaymentStatus.REFUNDED]: { color: 'bg-orange-100 text-orange-800', label: 'Remboursé' },
};

// Libellés des directions de paiement
const directionLabels: Record<PaymentDirection, string> = {
  [PaymentDirection.INBOUND]: 'Reçu',
  [PaymentDirection.OUTBOUND]: 'Envoyé',
};

interface PaymentsListProps {
  filters?: PaymentFilters;
  onSelectPayment: (payment: Payment) => void;
  className?: string;
}

const PaymentsList: React.FC<PaymentsListProps> = ({
  filters,
  onSelectPayment,
  className = '',
}) => {
  const { currency } = useCurrency();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les paiements
  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MobilePaymentAPI.getAll(filters);
      setPayments(data);
    } catch (err) {
      console.error('Erreur lors du chargement des paiements:', err);
      setError('Impossible de charger les paiements. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les paiements au chargement du composant et lorsque les filtres changent
  useEffect(() => {
    fetchPayments();
  }, [filters]);

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchPayments}
              className="mt-2 text-sm text-red-700 underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 text-center ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun paiement trouvé</h3>
        <p className="text-gray-500">Aucun paiement ne correspond aux critères de recherche.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {payments.map((payment) => (
        <div
          key={payment.id}
          onClick={() => onSelectPayment(payment)}
          className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{payment.reference}</h3>
              <p className="text-sm text-gray-500">{payment.description}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[payment.status].color}`}>
              {statusConfig[payment.status].label}
            </span>
          </div>
          <div className="flex flex-wrap justify-between items-end mt-4">
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${payment.direction === PaymentDirection.INBOUND ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm text-gray-700">
                {directionLabels[payment.direction]} via {providerNames[payment.provider]}
              </span>
            </div>
            <div className={`text-lg font-bold ${payment.direction === PaymentDirection.INBOUND ? 'text-green-600' : 'text-red-600'}`}>
              {payment.direction === PaymentDirection.INBOUND ? '+' : '-'} {formatCurrency(payment.amount, currency)}
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{payment.phoneNumber}</span>
            <span>{new Date(payment.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentsList;
