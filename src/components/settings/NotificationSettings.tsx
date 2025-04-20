import React, { useState } from 'react';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
}

const NotificationSettings: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'transaction_created',
      name: 'Nouvelle transaction',
      description: 'Notification lors de la création d\'une nouvelle transaction',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'payment_received',
      name: 'Paiement reçu',
      description: 'Notification lors de la réception d\'un paiement',
      email: true,
      inApp: true,
      sms: true
    },
    {
      id: 'payment_failed',
      name: 'Échec de paiement',
      description: 'Notification en cas d\'échec d\'un paiement',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'tax_deadline',
      name: 'Échéance fiscale',
      description: 'Rappel des échéances fiscales à venir',
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: 'client_added',
      name: 'Nouveau client',
      description: 'Notification lors de l\'ajout d\'un nouveau client',
      email: false,
      inApp: true,
      sms: false
    },
    {
      id: 'supplier_added',
      name: 'Nouveau fournisseur',
      description: 'Notification lors de l\'ajout d\'un nouveau fournisseur',
      email: false,
      inApp: true,
      sms: false
    },
    {
      id: 'low_balance',
      name: 'Solde bas',
      description: 'Alerte lorsque le solde est inférieur à un seuil défini',
      email: true,
      inApp: true,
      sms: true
    },
    {
      id: 'report_generated',
      name: 'Rapport généré',
      description: 'Notification lorsqu\'un rapport est généré',
      email: true,
      inApp: true,
      sms: false
    }
  ]);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [inAppNotifications, setInAppNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Fonction pour mettre à jour un paramètre de notification
  const updateNotificationSetting = (id: string, channel: 'email' | 'inApp' | 'sms', value: boolean) => {
    setNotificationSettings(
      notificationSettings.map(setting =>
        setting.id === id
          ? { ...setting, [channel]: value }
          : setting
      )
    );
  };

  // Fonction pour activer/désactiver tous les paramètres d'un canal
  const toggleAllChannelSettings = (channel: 'email' | 'inApp' | 'sms', value: boolean) => {
    setNotificationSettings(
      notificationSettings.map(setting => ({ ...setting, [channel]: value }))
    );
  };

  // Gérer le changement global des notifications par email
  const handleEmailToggle = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    toggleAllChannelSettings('email', newValue);
  };

  // Gérer le changement global des notifications in-app
  const handleInAppToggle = () => {
    const newValue = !inAppNotifications;
    setInAppNotifications(newValue);
    toggleAllChannelSettings('inApp', newValue);
  };

  // Gérer le changement global des notifications SMS
  const handleSmsToggle = () => {
    const newValue = !smsNotifications;
    setSmsNotifications(newValue);
    toggleAllChannelSettings('sms', newValue);
  };

  // Fonction pour sauvegarder les paramètres
  const handleSaveSettings = () => {
    setIsSaving(true);

    // Simuler une sauvegarde asynchrone
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres de Notification</h2>

      <div className="space-y-6">
        {/* Canaux de notification */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Canaux de Notification</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choisissez comment vous souhaitez recevoir les notifications.
          </p>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Notifications par Email</h4>
                <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
              </div>
              <div className="flex items-center">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={handleEmailToggle}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Notifications dans l'Application</h4>
                <p className="text-sm text-gray-600">Recevoir des notifications dans l'application</p>
              </div>
              <div className="flex items-center">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={inAppNotifications}
                    onChange={handleInAppToggle}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Notifications par SMS</h4>
                <p className="text-sm text-gray-600">Recevoir des notifications par SMS</p>
              </div>
              <div className="flex items-center">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={handleSmsToggle}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            {smsNotifications && (
              <div className="mt-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone pour les SMS
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+221 77 123 45 67"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format international requis (ex: +221 77 123 45 67)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Paramètres de notification */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Paramètres de Notification</h3>
          <p className="text-sm text-gray-600 mb-4">
            Personnalisez les types de notifications que vous souhaitez recevoir.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notification
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In-App
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SMS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notificationSettings.map((setting) => (
                  <tr key={setting.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{setting.name}</div>
                      <div className="text-sm text-gray-500">{setting.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={setting.email}
                        onChange={(e) => updateNotificationSetting(setting.id, 'email', e.target.checked)}
                        disabled={!emailNotifications}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={setting.inApp}
                        onChange={(e) => updateNotificationSetting(setting.id, 'inApp', e.target.checked)}
                        disabled={!inAppNotifications}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={setting.sms}
                        onChange={(e) => updateNotificationSetting(setting.id, 'sms', e.target.checked)}
                        disabled={!smsNotifications}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fréquence des notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Fréquence des Notifications</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="emailFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                Fréquence des emails récapitulatifs
              </label>
              <select
                id="emailFrequency"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                defaultValue="daily"
              >
                <option value="realtime">Temps réel</option>
                <option value="hourly">Toutes les heures</option>
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="never">Jamais</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="digestMode"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="digestMode" className="ml-2 block text-sm text-gray-700">
                Mode résumé (regrouper les notifications similaires)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="quietHours"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="quietHours" className="ml-2 block text-sm text-gray-700">
                Activer les heures de silence (pas de notifications entre 22h et 7h)
              </label>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isSaving
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>

        {/* Message de succès */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Paramètres de notification enregistrés avec succès
          </div>
        )}
      </div>

      {/* Styles pour les interrupteurs */}
      <style dangerouslySetInnerHTML={{ __html: `
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #3b82f6;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #3b82f6;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        .slider.round {
          border-radius: 24px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      ` }} />
    </div>
  );
};

export default NotificationSettings;
