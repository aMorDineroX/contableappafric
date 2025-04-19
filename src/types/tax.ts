// Types de taxes
export enum TaxType {
  VAT = 'VAT', // TVA (Taxe sur la Valeur Ajoutée)
  CORPORATE_INCOME = 'CORPORATE_INCOME', // Impôt sur les sociétés
  WITHHOLDING = 'WITHHOLDING', // Retenue à la source
  PAYROLL = 'PAYROLL', // Charges sociales
  PROPERTY = 'PROPERTY', // Taxe foncière
  BUSINESS_LICENSE = 'BUSINESS_LICENSE', // Patente
  CUSTOMS_DUTY = 'CUSTOMS_DUTY', // Droits de douane
  EXCISE_DUTY = 'EXCISE_DUTY', // Droits d'accise
  STAMP_DUTY = 'STAMP_DUTY', // Droits de timbre
  DIVIDEND = 'DIVIDEND', // Taxe sur les dividendes
  CAPITAL_GAINS = 'CAPITAL_GAINS', // Taxe sur les plus-values
  OTHER = 'OTHER', // Autres taxes
}

// Fréquence de déclaration fiscale
export enum FilingFrequency {
  MONTHLY = 'MONTHLY', // Mensuelle
  QUARTERLY = 'QUARTERLY', // Trimestrielle
  SEMI_ANNUAL = 'SEMI_ANNUAL', // Semestrielle
  ANNUAL = 'ANNUAL', // Annuelle
}

// Statut de conformité fiscale
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT', // Conforme
  NON_COMPLIANT = 'NON_COMPLIANT', // Non conforme
  PENDING = 'PENDING', // En attente
  EXEMPTED = 'EXEMPTED', // Exonéré
  NOT_APPLICABLE = 'NOT_APPLICABLE', // Non applicable
}

// Pays africains supportés
export enum AfricanCountry {
  SENEGAL = 'SENEGAL',
  COTE_DIVOIRE = 'COTE_DIVOIRE',
  CAMEROUN = 'CAMEROUN',
  MALI = 'MALI',
  BURKINA_FASO = 'BURKINA_FASO',
  BENIN = 'BENIN',
  TOGO = 'TOGO',
  NIGER = 'NIGER',
  GUINEE = 'GUINEE',
  KENYA = 'KENYA',
  GHANA = 'GHANA',
  NIGERIA = 'NIGERIA',
  SOUTH_AFRICA = 'SOUTH_AFRICA',
  MOROCCO = 'MOROCCO',
  TUNISIA = 'TUNISIA',
  EGYPT = 'EGYPT',
  ALGERIA = 'ALGERIA',
  TANZANIA = 'TANZANIA',
  UGANDA = 'UGANDA',
  RWANDA = 'RWANDA',
  ETHIOPIA = 'ETHIOPIA',
  GABON = 'GABON',
  CONGO = 'CONGO',
  DR_CONGO = 'DR_CONGO',
}

// Régions économiques africaines
export enum EconomicRegion {
  UEMOA = 'UEMOA', // Union Économique et Monétaire Ouest-Africaine
  CEMAC = 'CEMAC', // Communauté Économique et Monétaire de l'Afrique Centrale
  ECOWAS = 'ECOWAS', // Economic Community of West African States
  EAC = 'EAC', // East African Community
  SADC = 'SADC', // Southern African Development Community
  AMU = 'AMU', // Arab Maghreb Union
  COMESA = 'COMESA', // Common Market for Eastern and Southern Africa
  OHADA = 'OHADA', // Organisation pour l'Harmonisation en Afrique du Droit des Affaires
}

// Secteurs d'activité avec des règles fiscales spécifiques
export enum BusinessSector {
  GENERAL = 'GENERAL', // Général
  AGRICULTURE = 'AGRICULTURE', // Agriculture
  MINING = 'MINING', // Mines
  OIL_GAS = 'OIL_GAS', // Pétrole et gaz
  MANUFACTURING = 'MANUFACTURING', // Industrie manufacturière
  CONSTRUCTION = 'CONSTRUCTION', // Construction
  RETAIL = 'RETAIL', // Commerce de détail
  WHOLESALE = 'WHOLESALE', // Commerce de gros
  TRANSPORTATION = 'TRANSPORTATION', // Transport
  TELECOMMUNICATIONS = 'TELECOMMUNICATIONS', // Télécommunications
  FINANCIAL_SERVICES = 'FINANCIAL_SERVICES', // Services financiers
  REAL_ESTATE = 'REAL_ESTATE', // Immobilier
  TOURISM = 'TOURISM', // Tourisme
  EDUCATION = 'EDUCATION', // Éducation
  HEALTHCARE = 'HEALTHCARE', // Santé
  TECHNOLOGY = 'TECHNOLOGY', // Technologie
  EXPORT = 'EXPORT', // Exportation
}

// Interface pour une règle fiscale
export interface TaxRule {
  id: string;
  country: AfricanCountry;
  type: TaxType;
  name: string;
  description: string;
  standardRate: number; // Taux standard en pourcentage
  reducedRates?: { [key: string]: number }; // Taux réduits avec leurs descriptions
  exemptions?: string[]; // Liste des exemptions
  deductions?: string[]; // Liste des déductions
  thresholds?: { [key: string]: number }; // Seuils d'application
  filingFrequency: FilingFrequency;
  paymentDeadline: string; // Description du délai de paiement
  applicableSectors?: BusinessSector[]; // Secteurs d'activité concernés
  legalReferences?: string[]; // Références légales
  effectiveDate: string; // Date d'entrée en vigueur
  lastUpdated: string; // Date de dernière mise à jour
  notes?: string; // Notes supplémentaires
}

// Interface pour un régime fiscal par pays
export interface CountryTaxRegime {
  country: AfricanCountry;
  countryName: string;
  currency: string;
  economicRegions: EconomicRegion[];
  fiscalYear: {
    startMonth: number; // 1-12
    startDay: number; // 1-31
  };
  vatRegistrationThreshold: number; // Seuil d'assujettissement à la TVA
  corporateTaxRate: number; // Taux d'impôt sur les sociétés
  dividendWithholdingRate: number; // Taux de retenue à la source sur les dividendes
  interestWithholdingRate: number; // Taux de retenue à la source sur les intérêts
  royaltyWithholdingRate: number; // Taux de retenue à la source sur les redevances
  taxRules: TaxRule[]; // Règles fiscales spécifiques
  taxAuthority: {
    name: string;
    website: string;
    contactInfo: string;
  };
  taxIncentives?: string[]; // Incitations fiscales
  doubleTaxationAgreements?: string[]; // Conventions fiscales
  lastUpdated: string; // Date de dernière mise à jour
}

// Interface pour une obligation fiscale
export interface TaxObligation {
  id: string;
  companyId: string;
  country: AfricanCountry;
  taxType: TaxType;
  period: {
    startDate: string;
    endDate: string;
  };
  dueDate: string;
  amount: number;
  currency: string;
  status: ComplianceStatus;
  filingReference?: string;
  paymentReference?: string;
  attachments?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour un calendrier fiscal
export interface TaxCalendar {
  id: string;
  companyId: string;
  country: AfricanCountry;
  fiscalYear: number;
  obligations: {
    [key: string]: { // Clé: mois-jour (MM-DD)
      taxType: TaxType;
      description: string;
      dueDate: string;
    }[];
  };
  lastUpdated: string;
}

// Interface pour les statistiques de conformité fiscale
export interface TaxComplianceStats {
  totalObligations: number;
  compliantObligations: number;
  nonCompliantObligations: number;
  pendingObligations: number;
  complianceRate: number; // Pourcentage
  upcomingObligations: TaxObligation[];
  overdueObligations: TaxObligation[];
  totalTaxPaid: number;
  taxByType: {
    [key in TaxType]?: number;
  };
  taxByCountry: {
    [key in AfricanCountry]?: number;
  };
}

// Interface pour les filtres de recherche d'obligations fiscales
export interface TaxObligationFilters {
  countries?: AfricanCountry[];
  taxTypes?: TaxType[];
  startDate?: string;
  endDate?: string;
  status?: ComplianceStatus[];
  minAmount?: number;
  maxAmount?: number;
}
