import { Currency } from '../utils/currencies';
import { AfricanCountry, TaxType, FilingFrequency } from '../types/tax';
import { MobilePaymentProvider } from '../types/payment';

// Types pour les paramètres
export interface GeneralSettings {
  language: string;
  dateFormat: string;
  timeFormat: string;
  theme: string;
}

export interface CurrencySettings {
  primaryCurrency: Currency;
  secondaryCurrencies: Currency[];
  showCurrencySymbol: boolean;
  showCurrencyCode: boolean;
  showAlternativeCurrency: boolean;
}

export interface TaxSettings {
  country: AfricanCountry;
  vatEnabled: boolean;
  vatRate: number;
  vatFilingFrequency: FilingFrequency;
  corporateTaxEnabled: boolean;
  corporateTaxRate: number;
  withholdingTaxEnabled: boolean;
  withholdingTaxRate: number;
}

export interface PaymentSettings {
  provider: MobilePaymentProvider;
  apiKey: string;
  apiSecret: string;
  merchantId: string;
  environment: 'sandbox' | 'production';
  callbackUrl: string;
  enabledCountries: AfricanCountry[];
  autoCapture: boolean;
  savePaymentInfo: boolean;
  enableWebhooks: boolean;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  inAppEnabled: boolean;
  smsEnabled: boolean;
  phoneNumber: string;
  emailFrequency: string;
  digestMode: boolean;
  quietHours: boolean;
  notificationPreferences: {
    id: string;
    email: boolean;
    inApp: boolean;
    sms: boolean;
  }[];
}

export interface SettingsProfile {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  general: GeneralSettings;
  currency: CurrencySettings;
  tax: TaxSettings;
  payment: PaymentSettings;
  notification: NotificationSettings;
  profile: SettingsProfile;
}

// Service pour gérer les paramètres
class SettingsService {
  private readonly SETTINGS_KEY = 'contafricax_settings';
  private readonly PROFILES_KEY = 'contafricax_settings_profiles';

  // Obtenir les paramètres actuels
  getSettings(): AppSettings | null {
    const settingsJson = localStorage.getItem(this.SETTINGS_KEY);
    if (settingsJson) {
      try {
        return JSON.parse(settingsJson);
      } catch (error) {
        console.error('Erreur lors de la lecture des paramètres:', error);
        return null;
      }
    }
    return null;
  }

  // Sauvegarder les paramètres
  saveSettings(settings: AppSettings): boolean {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      return false;
    }
  }

  // Exporter les paramètres sous forme de fichier JSON
  exportSettings(): string {
    const settings = this.getSettings();
    if (!settings) {
      throw new Error('Aucun paramètre à exporter');
    }
    
    return JSON.stringify(settings, null, 2);
  }

  // Importer les paramètres depuis un fichier JSON
  importSettings(settingsJson: string): boolean {
    try {
      const settings = JSON.parse(settingsJson) as AppSettings;
      return this.saveSettings(settings);
    } catch (error) {
      console.error('Erreur lors de l\'importation des paramètres:', error);
      return false;
    }
  }

  // Obtenir tous les profils de paramètres
  getProfiles(): SettingsProfile[] {
    const profilesJson = localStorage.getItem(this.PROFILES_KEY);
    if (profilesJson) {
      try {
        return JSON.parse(profilesJson);
      } catch (error) {
        console.error('Erreur lors de la lecture des profils:', error);
        return [];
      }
    }
    return [];
  }

  // Sauvegarder un profil de paramètres
  saveProfile(profile: SettingsProfile, settings: AppSettings): boolean {
    try {
      // Mettre à jour le profil dans les paramètres
      settings.profile = profile;
      
      // Sauvegarder les paramètres
      this.saveSettings(settings);
      
      // Mettre à jour la liste des profils
      const profiles = this.getProfiles();
      const existingIndex = profiles.findIndex(p => p.id === profile.id);
      
      if (existingIndex >= 0) {
        profiles[existingIndex] = profile;
      } else {
        profiles.push(profile);
      }
      
      localStorage.setItem(this.PROFILES_KEY, JSON.stringify(profiles));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      return false;
    }
  }

  // Charger un profil de paramètres
  loadProfile(profileId: string): AppSettings | null {
    const profiles = this.getProfiles();
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) {
      return null;
    }
    
    const settings = this.getSettings();
    if (!settings) {
      return null;
    }
    
    // Mettre à jour le profil actif
    settings.profile = profile;
    
    // Sauvegarder les paramètres
    this.saveSettings(settings);
    
    return settings;
  }

  // Supprimer un profil de paramètres
  deleteProfile(profileId: string): boolean {
    try {
      const profiles = this.getProfiles();
      const filteredProfiles = profiles.filter(p => p.id !== profileId);
      
      if (filteredProfiles.length === profiles.length) {
        return false; // Profil non trouvé
      }
      
      localStorage.setItem(this.PROFILES_KEY, JSON.stringify(filteredProfiles));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du profil:', error);
      return false;
    }
  }

  // Réinitialiser tous les paramètres
  resetSettings(): boolean {
    try {
      localStorage.removeItem(this.SETTINGS_KEY);
      return true;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des paramètres:', error);
      return false;
    }
  }
}

export const settingsService = new SettingsService();
