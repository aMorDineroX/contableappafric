import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail = () => {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const { user, sendVerificationEmail } = useAuth();

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await sendVerificationEmail();
      setMessage('Email de vérification envoyé avec succès');
    } catch (error) {
      setMessage('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vérifiez votre email
            </h2>
            <p className="text-gray-600 mb-6">
              Un email de vérification a été envoyé à {user?.email}
            </p>
            
            {message && (
              <div className={`p-4 rounded-md mb-4 ${
                message.includes('succès') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isResending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isResending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                'Renvoyer l\'email de vérification'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
