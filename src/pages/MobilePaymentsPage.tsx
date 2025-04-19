import React, { useState } from 'react';
import { Payment, PaymentFilters, MobilePaymentInfo, PaymentRequest, PaymentDirection } from '../types/payment';
import { MobilePaymentAPI } from '../services/mobilePaymentApi';
import { useCurrency } from '../contexts/CurrencyContext';
import MobilePaymentForm from '../components/payments/MobilePaymentForm';
import PaymentsList from '../components/payments/PaymentsList';
import PaymentDetails from '../components/payments/PaymentDetails';
import PaymentFiltersComponent from '../components/payments/PaymentFilters';
import PaymentStats from '../components/payments/PaymentStats';

enum PaymentTab {
  LIST = 'list',
  STATS = 'stats',
  NEW_PAYMENT = 'new_payment',
}

const MobilePaymentsPage: React.FC = () => {
  const { currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<PaymentTab>(PaymentTab.LIST);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Gérer la soumission d'un nouveau paiement
  const handleSubmitPayment = async (paymentInfo: MobilePaymentInfo) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Créer une demande de paiement
      const paymentRequest: PaymentRequest = {
        amount: 10000, // Montant fixe pour cet exemple
        currency: currency,
        description: 'Paiement test',
        reference: `PAY-${Date.now()}`,
        paymentMethod: paymentInfo,
      };

      // Initier le paiement
      const response = await MobilePaymentAPI.initiatePayment(paymentRequest);

      // Afficher un message de succès
      setSuccess('Paiement initié avec succès. Veuillez suivre les instructions pour compléter le paiement.');

      // Rediriger vers l'URL de paiement si disponible
      if (response.redirectUrl) {
        window.open(response.redirectUrl, '_blank');
      }

      // Fermer le modal et réinitialiser le formulaire
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setActiveTab(PaymentTab.LIST);
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de l\'initiation du paiement:', err);
      setError('Impossible d\'initier le paiement. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la sélection d'un paiement
  const handleSelectPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  // Gérer la fermeture du modal de détails
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPayment(null);
  };

  // Gérer le rafraîchissement de la liste des paiements
  const handleRefreshPayments = () => {
    // Forcer le rechargement des paiements en modifiant légèrement les filtres
    setFilters({ ...filters });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Paiements Mobiles</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab(PaymentTab.NEW_PAYMENT)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouveau Paiement
            </button>
          </div>
        </div>

        {/* Messages d'erreur ou de succès */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab(PaymentTab.LIST)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === PaymentTab.LIST
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Liste des paiements
            </button>
            <button
              onClick={() => setActiveTab(PaymentTab.STATS)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === PaymentTab.STATS
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Statistiques
            </button>
            <button
              onClick={() => setActiveTab(PaymentTab.NEW_PAYMENT)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === PaymentTab.NEW_PAYMENT
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nouveau paiement
            </button>
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filtres (uniquement pour les onglets Liste et Statistiques) */}
          {(activeTab === PaymentTab.LIST || activeTab === PaymentTab.STATS) && (
            <div className="md:col-span-1">
              <PaymentFiltersComponent
                onFilterChange={setFilters}
                initialFilters={filters}
              />
            </div>
          )}

          {/* Contenu principal */}
          <div className={`${(activeTab === PaymentTab.LIST || activeTab === PaymentTab.STATS) ? 'md:col-span-3' : 'md:col-span-4'}`}>
            {activeTab === PaymentTab.LIST && (
              <PaymentsList
                filters={filters}
                onSelectPayment={handleSelectPayment}
              />
            )}

            {activeTab === PaymentTab.STATS && (
              <PaymentStats filters={filters} />
            )}

            {activeTab === PaymentTab.NEW_PAYMENT && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Nouveau Paiement Mobile</h2>
                <MobilePaymentForm
                  onSubmit={handleSubmitPayment}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal de détails de paiement */}
        {isDetailsModalOpen && selectedPayment && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Détails du Paiement</h2>
                  <button
                    onClick={handleCloseDetailsModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <PaymentDetails
                  paymentId={selectedPayment.id}
                  onRefresh={handleRefreshPayments}
                  onCancel={() => {
                    handleCloseDetailsModal();
                    handleRefreshPayments();
                  }}
                  onRefund={() => {
                    handleCloseDetailsModal();
                    handleRefreshPayments();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePaymentsPage;
