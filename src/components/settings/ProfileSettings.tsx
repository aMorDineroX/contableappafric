import React, { useState, useEffect } from 'react';
import { settingsService, SettingsProfile, AppSettings } from '../../services/settingsService';

interface ProfileSettingsProps {
  onProfileChange?: (settings: AppSettings) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onProfileChange }) => {
  const [profiles, setProfiles] = useState<SettingsProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);
  const [newProfileName, setNewProfileName] = useState<string>('');
  const [newProfileDescription, setNewProfileDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les profils au chargement du composant
  useEffect(() => {
    loadProfiles();
  }, []);

  // Fonction pour charger les profils
  const loadProfiles = () => {
    setIsLoading(true);
    
    try {
      const loadedProfiles = settingsService.getProfiles();
      setProfiles(loadedProfiles);
      
      // Définir le profil actif
      const settings = settingsService.getSettings();
      if (settings && settings.profile) {
        setActiveProfileId(settings.profile.id);
      } else if (loadedProfiles.length > 0) {
        // Utiliser le premier profil par défaut
        const defaultProfile = loadedProfiles.find(p => p.isDefault) || loadedProfiles[0];
        setActiveProfileId(defaultProfile.id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
      setError('Erreur lors du chargement des profils');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour changer de profil
  const handleProfileChange = (profileId: string) => {
    if (profileId === activeProfileId) {
      return;
    }
    
    try {
      const settings = settingsService.loadProfile(profileId);
      
      if (settings) {
        setActiveProfileId(profileId);
        
        // Notifier le composant parent que le profil a changé
        if (onProfileChange) {
          onProfileChange(settings);
        }
      } else {
        setError('Erreur lors du chargement du profil');
      }
    } catch (error) {
      console.error('Erreur lors du changement de profil:', error);
      setError('Erreur lors du changement de profil');
    }
  };

  // Fonction pour créer un nouveau profil
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      setError('Le nom du profil est requis');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Créer un nouvel ID unique
      const newProfileId = `profile_${Date.now()}`;
      
      // Créer le nouveau profil
      const newProfile: SettingsProfile = {
        id: newProfileId,
        name: newProfileName.trim(),
        description: newProfileDescription.trim(),
        isDefault: profiles.length === 0, // Premier profil est le profil par défaut
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Obtenir les paramètres actuels
      let settings = settingsService.getSettings();
      
      if (!settings) {
        // Créer des paramètres par défaut si aucun n'existe
        settings = {
          general: {
            language: 'fr',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            theme: 'light'
          },
          currency: {
            primaryCurrency: 'XOF',
            secondaryCurrencies: ['EUR', 'USD'],
            showCurrencySymbol: true,
            showCurrencyCode: false,
            showAlternativeCurrency: true
          },
          tax: {
            country: 'SENEGAL' as any,
            vatEnabled: true,
            vatRate: 18,
            vatFilingFrequency: 'MONTHLY' as any,
            corporateTaxEnabled: true,
            corporateTaxRate: 30,
            withholdingTaxEnabled: false,
            withholdingTaxRate: 10
          },
          payment: {
            provider: '' as any,
            apiKey: '',
            apiSecret: '',
            merchantId: '',
            environment: 'sandbox',
            callbackUrl: '',
            enabledCountries: [],
            autoCapture: true,
            savePaymentInfo: true,
            enableWebhooks: true
          },
          notification: {
            emailEnabled: true,
            inAppEnabled: true,
            smsEnabled: false,
            phoneNumber: '',
            emailFrequency: 'daily',
            digestMode: true,
            quietHours: true,
            notificationPreferences: []
          },
          profile: newProfile
        };
      } else {
        // Mettre à jour le profil dans les paramètres
        settings.profile = newProfile;
      }
      
      // Sauvegarder le profil
      const success = settingsService.saveProfile(newProfile, settings);
      
      if (success) {
        // Recharger les profils
        loadProfiles();
        
        // Définir le nouveau profil comme actif
        setActiveProfileId(newProfileId);
        
        // Réinitialiser le formulaire
        setNewProfileName('');
        setNewProfileDescription('');
        setIsCreatingProfile(false);
        
        // Afficher le message de succès
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
        
        // Notifier le composant parent que le profil a changé
        if (onProfileChange) {
          onProfileChange(settings);
        }
      } else {
        setError('Erreur lors de la création du profil');
      }
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      setError('Erreur lors de la création du profil');
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour supprimer un profil
  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) {
      setError('Impossible de supprimer le dernier profil');
      return;
    }
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.')) {
      try {
        const success = settingsService.deleteProfile(profileId);
        
        if (success) {
          // Recharger les profils
          loadProfiles();
          
          // Si le profil supprimé était actif, activer le premier profil
          if (profileId === activeProfileId) {
            const remainingProfiles = profiles.filter(p => p.id !== profileId);
            if (remainingProfiles.length > 0) {
              handleProfileChange(remainingProfiles[0].id);
            }
          }
        } else {
          setError('Erreur lors de la suppression du profil');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du profil:', error);
        setError('Erreur lors de la suppression du profil');
      }
    }
  };

  // Fonction pour définir un profil comme profil par défaut
  const handleSetDefaultProfile = (profileId: string) => {
    try {
      // Mettre à jour tous les profils
      const updatedProfiles = profiles.map(profile => ({
        ...profile,
        isDefault: profile.id === profileId,
        updatedAt: profile.id === profileId ? new Date().toISOString() : profile.updatedAt
      }));
      
      // Sauvegarder les profils mis à jour
      localStorage.setItem('contafricax_settings_profiles', JSON.stringify(updatedProfiles));
      
      // Recharger les profils
      loadProfiles();
      
      // Afficher le message de succès
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la définition du profil par défaut:', error);
      setError('Erreur lors de la définition du profil par défaut');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Profils de Paramètres</h3>
      <p className="text-sm text-gray-600 mb-4">
        Créez et gérez différents profils de paramètres pour différentes entités ou utilisateurs.
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Liste des profils */}
          {profiles.length > 0 ? (
            <div className="space-y-2">
              {profiles.map(profile => (
                <div
                  key={profile.id}
                  className={`border rounded-lg p-3 transition-all ${
                    profile.id === activeProfileId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`profile-${profile.id}`}
                        name="profile"
                        checked={profile.id === activeProfileId}
                        onChange={() => handleProfileChange(profile.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor={`profile-${profile.id}`} className="ml-2 block">
                        <span className="font-medium text-gray-800">{profile.name}</span>
                        {profile.isDefault && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Par défaut
                          </span>
                        )}
                        {profile.description && (
                          <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
                        )}
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      {!profile.isDefault && (
                        <button
                          onClick={() => handleSetDefaultProfile(profile.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Définir comme profil par défaut"
                        >
                          <i className="fas fa-star"></i>
                        </button>
                      )}
                      {profiles.length > 1 && (
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Supprimer ce profil"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Aucun profil trouvé. Créez votre premier profil.
            </div>
          )}
          
          {/* Formulaire de création de profil */}
          {isCreatingProfile ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-800 mb-3">Nouveau Profil</h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du profil *
                  </label>
                  <input
                    type="text"
                    id="profileName"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Entreprise principale"
                  />
                </div>
                <div>
                  <label htmlFor="profileDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="profileDescription"
                    value={newProfileDescription}
                    onChange={(e) => setNewProfileDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Paramètres pour l'entreprise principale"
                    rows={2}
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsCreatingProfile(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateProfile}
                    disabled={isSaving || !newProfileName.trim()}
                    className={`px-4 py-2 rounded-md text-white ${
                      isSaving || !newProfileName.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Création...
                      </>
                    ) : (
                      'Créer le profil'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingProfile(true)}
              className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Créer un nouveau profil
            </button>
          )}
        </div>
      )}
      
      {/* Messages d'erreur/succès */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
          Profil enregistré avec succès
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
