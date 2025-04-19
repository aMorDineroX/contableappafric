import React, { useState, useEffect } from 'react';
import { Payment, PaymentStatus, MobilePaymentProvider, AfricanCountry } from '../../types/payment';
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

interface PaymentDetailsProps {
  paymentId: string;
  onRefresh?: () => void;
  onCancel?: () => void;
  onRefund?: () => void;
  className?: string;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentId,
  onRefresh,
  onCancel,
  onRefund,
  className = '',
}) => {
  const { currency } = useCurrency();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Charger les détails du paiement
  const fetchPaymentDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MobilePaymentAPI.getById(paymentId);
      setPayment(data);
    } catch (err) {
      console.error('Erreur lors du chargement des détails du paiement:', err);
      setError('Impossible de charger les détails du paiement. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les détails du paiement au chargement du composant
  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentId]);

  // Mettre en place un polling pour les paiements en cours
  useEffect(() => {
    if (!payment) return;

    // Si le paiement est en attente, initié ou en cours, mettre en place un polling
    const shouldPoll = [
      PaymentStatus.PENDING,
      PaymentStatus.INITIATED,
      PaymentStatus.PROCESSING,
    ].includes(payment.status);

    if (shouldPoll && !isPolling) {
      setIsPolling(true);
      const interval = setInterval(async () => {
        try {
          const status = await MobilePaymentAPI.checkPaymentStatus(paymentId);
          if (status !== payment.status) {
            // Si le statut a changé, recharger les détails du paiement
            fetchPaymentDetails();
          }
        } catch (err) {
          console.error('Erreur lors de la vérification du statut du paiement:', err);
        }
      }, 5000); // Vérifier toutes les 5 secondes

      return () => {
        clearInterval(interval);
        setIsPolling(false);
      };
    }
  }, [payment, paymentId]);

  // Gérer l'annulation du paiement
  const handleCancel = async () => {
    if (!payment || !onCancel) return;

    setIsProcessing(true);
    try {
      await MobilePaymentAPI.cancelPayment(paymentId);
      fetchPaymentDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Erreur lors de l\'annulation du paiement:', err);
      setError('Impossible d\'annuler le paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Gérer le remboursement du paiement
  const handleRefund = async () => {
    if (!payment || !onRefund) return;

    setIsProcessing(true);
    try {
      await MobilePaymentAPI.refundPayment(paymentId);
      fetchPaymentDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Erreur lors du remboursement du paiement:', err);
      setError('Impossible de rembourser le paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
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
              onClick={fetchPaymentDetails}
              className="mt-2 text-sm text-red-700 underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className={`text-gray-500 ${className}`}>
        Aucun détail de paiement disponible.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec montant et statut */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {formatCurrency(payment.amount, currency)}
          </h2>
          <p className="text-sm text-gray-500">
            {payment.description}
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[payment.status].color}`}>
            {statusConfig[payment.status].label}
          </span>
        </div>
      </div>

      {/* Détails du paiement */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Détails du paiement</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Référence</dt>
              <dd className="mt-1 text-sm text-gray-900">{payment.reference}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID de transaction</dt>
              <dd className="mt-1 text-sm text-gray-900">{payment.transactionId || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fournisseur</dt>
              <dd className="mt-1 text-sm text-gray-900">{providerNames[payment.provider]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Numéro de téléphone</dt>
              <dd className="mt-1 text-sm text-gray-900">{payment.phoneNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pays</dt>
              <dd className="mt-1 text-sm text-gray-900">{countryNames[payment.country]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date de création</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(payment.createdAt).toLocaleString('fr-FR')}
              </dd>
            </div>
            {payment.completedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Date de complétion</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(payment.completedAt).toLocaleString('fr-FR')}
                </dd>
              </div>
            )}
            {payment.failureReason && (
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Raison de l'échec</dt>
                <dd className="mt-1 text-sm text-red-600">{payment.failureReason}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Bouton de rafraîchissement */}
        <button
          onClick={fetchPaymentDetails}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>

        {/* Bouton d'annulation (uniquement pour les paiements en attente ou initiés) */}
        {onCancel && [PaymentStatus.PENDING, PaymentStatus.INITIATED].includes(payment.status) && (
          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Annulation...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </>
            )}
          </button>
        )}

        {/* Bouton de remboursement (uniquement pour les paiements complétés) */}
        {onRefund && payment.status === PaymentStatus.COMPLETED && (
          <button
            onClick={handleRefund}
            disabled={isProcessing}
            className="inline-flex items-center px-4 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Remboursement...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Rembourser
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
