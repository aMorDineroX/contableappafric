import React, { useState, useEffect } from 'react';
import { AfricanCountry, TaxType, FilingFrequency } from '../../types/tax';

interface TaxDeadline {
  id: string;
  country: AfricanCountry;
  taxType: TaxType;
  description: string;
  dueDate: Date;
  filingFrequency: FilingFrequency;
  isRecurring: boolean;
}

interface TaxCalendarProps {
  selectedCountry: AfricanCountry | '';
}

const TaxCalendar: React.FC<TaxCalendarProps> = ({ selectedCountry }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [deadlines, setDeadlines] = useState<TaxDeadline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Noms des mois en français
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Noms des jours en français
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Fonction pour générer les échéances fiscales en fonction du pays sélectionné
  useEffect(() => {
    if (!selectedCountry) {
      setDeadlines([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Simuler un chargement asynchrone
    setTimeout(() => {
      const generatedDeadlines = generateTaxDeadlines(selectedCountry as AfricanCountry);
      setDeadlines(generatedDeadlines);
      setIsLoading(false);
    }, 500);
  }, [selectedCountry]);

  // Fonction pour générer les échéances fiscales pour un pays donné
  const generateTaxDeadlines = (country: AfricanCountry): TaxDeadline[] => {
    const currentYear = new Date().getFullYear();
    const generatedDeadlines: TaxDeadline[] = [];

    // Échéances TVA (mensuelles ou trimestrielles selon le pays)
    if (country === AfricanCountry.SENEGAL || 
        country === AfricanCountry.COTE_DIVOIRE || 
        country === AfricanCountry.MALI) {
      // TVA mensuelle (15 du mois suivant)
      for (let month = 0; month < 12; month++) {
        const dueDate = new Date(currentYear, month + 1, 15);
        generatedDeadlines.push({
          id: `vat_monthly_${month}`,
          country,
          taxType: TaxType.VAT,
          description: `Déclaration et paiement de la TVA pour ${monthNames[month]}`,
          dueDate,
          filingFrequency: FilingFrequency.MONTHLY,
          isRecurring: true
        });
      }
    } else if (country === AfricanCountry.KENYA || 
               country === AfricanCountry.GHANA || 
               country === AfricanCountry.NIGERIA) {
      // TVA trimestrielle
      for (let quarter = 0; quarter < 4; quarter++) {
        const dueDate = new Date(currentYear, quarter * 3 + 3, 20);
        generatedDeadlines.push({
          id: `vat_quarterly_${quarter}`,
          country,
          taxType: TaxType.VAT,
          description: `Déclaration et paiement de la TVA pour le ${quarter + 1}e trimestre`,
          dueDate,
          filingFrequency: FilingFrequency.QUARTERLY,
          isRecurring: true
        });
      }
    }

    // Impôt sur les sociétés (annuel)
    const corporateTaxDueDate = new Date(currentYear, 3, 30); // 30 avril
    generatedDeadlines.push({
      id: 'corporate_tax_annual',
      country,
      taxType: TaxType.CORPORATE_INCOME,
      description: 'Déclaration et paiement de l\'impôt sur les sociétés',
      dueDate: corporateTaxDueDate,
      filingFrequency: FilingFrequency.ANNUAL,
      isRecurring: true
    });

    // Acomptes d'impôt sur les sociétés (trimestriels)
    for (let quarter = 0; quarter < 4; quarter++) {
      const dueDate = new Date(currentYear, quarter * 3 + 2, 15);
      generatedDeadlines.push({
        id: `corporate_tax_installment_${quarter}`,
        country,
        taxType: TaxType.CORPORATE_INCOME,
        description: `Paiement de l'acompte d'impôt sur les sociétés (${quarter + 1}e trimestre)`,
        dueDate,
        filingFrequency: FilingFrequency.QUARTERLY,
        isRecurring: true
      });
    }

    // Retenues à la source (mensuelles)
    for (let month = 0; month < 12; month++) {
      const dueDate = new Date(currentYear, month + 1, 10);
      generatedDeadlines.push({
        id: `withholding_tax_${month}`,
        country,
        taxType: TaxType.WITHHOLDING,
        description: `Déclaration et paiement des retenues à la source pour ${monthNames[month]}`,
        dueDate,
        filingFrequency: FilingFrequency.MONTHLY,
        isRecurring: true
      });
    }

    // Charges sociales (mensuelles)
    for (let month = 0; month < 12; month++) {
      const dueDate = new Date(currentYear, month + 1, 15);
      generatedDeadlines.push({
        id: `payroll_tax_${month}`,
        country,
        taxType: TaxType.PAYROLL,
        description: `Déclaration et paiement des charges sociales pour ${monthNames[month]}`,
        dueDate,
        filingFrequency: FilingFrequency.MONTHLY,
        isRecurring: true
      });
    }

    // Patente (annuelle)
    const businessLicenseDueDate = new Date(currentYear, 0, 31); // 31 janvier
    generatedDeadlines.push({
      id: 'business_license',
      country,
      taxType: TaxType.BUSINESS_LICENSE,
      description: 'Paiement de la patente',
      dueDate: businessLicenseDueDate,
      filingFrequency: FilingFrequency.ANNUAL,
      isRecurring: true
    });

    // Taxe foncière (annuelle)
    const propertyTaxDueDate = new Date(currentYear, 2, 31); // 31 mars
    generatedDeadlines.push({
      id: 'property_tax',
      country,
      taxType: TaxType.PROPERTY,
      description: 'Paiement de la taxe foncière',
      dueDate: propertyTaxDueDate,
      filingFrequency: FilingFrequency.ANNUAL,
      isRecurring: true
    });

    return generatedDeadlines;
  };

  // Fonction pour obtenir le nombre de jours dans un mois
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Fonction pour obtenir le premier jour de la semaine du mois
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Fonction pour générer les jours du mois
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Ajouter les jours vides pour le début du mois
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Fonction pour vérifier si une date a des échéances
  const hasDeadlines = (day: number): boolean => {
    if (!day) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return deadlines.some(deadline => {
      const deadlineDate = new Date(deadline.dueDate);
      return (
        deadlineDate.getDate() === date.getDate() &&
        deadlineDate.getMonth() === date.getMonth() &&
        deadlineDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Fonction pour obtenir les échéances d'une date
  const getDeadlinesForDay = (day: number): TaxDeadline[] => {
    if (!day) return [];
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return deadlines.filter(deadline => {
      const deadlineDate = new Date(deadline.dueDate);
      return (
        deadlineDate.getDate() === date.getDate() &&
        deadlineDate.getMonth() === date.getMonth() &&
        deadlineDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Fonction pour obtenir la couleur en fonction du type de taxe
  const getTaxTypeColor = (taxType: TaxType): string => {
    switch (taxType) {
      case TaxType.VAT:
        return 'bg-blue-100 text-blue-800';
      case TaxType.CORPORATE_INCOME:
        return 'bg-red-100 text-red-800';
      case TaxType.WITHHOLDING:
        return 'bg-green-100 text-green-800';
      case TaxType.PAYROLL:
        return 'bg-purple-100 text-purple-800';
      case TaxType.PROPERTY:
        return 'bg-yellow-100 text-yellow-800';
      case TaxType.BUSINESS_LICENSE:
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir le nom du type de taxe
  const getTaxTypeName = (taxType: TaxType): string => {
    switch (taxType) {
      case TaxType.VAT:
        return 'TVA';
      case TaxType.CORPORATE_INCOME:
        return 'IS';
      case TaxType.WITHHOLDING:
        return 'Retenue';
      case TaxType.PAYROLL:
        return 'Charges';
      case TaxType.PROPERTY:
        return 'Foncier';
      case TaxType.BUSINESS_LICENSE:
        return 'Patente';
      case TaxType.CUSTOMS_DUTY:
        return 'Douane';
      case TaxType.EXCISE_DUTY:
        return 'Accise';
      case TaxType.STAMP_DUTY:
        return 'Timbre';
      case TaxType.DIVIDEND:
        return 'Dividende';
      case TaxType.CAPITAL_GAINS:
        return 'Plus-value';
      case TaxType.OTHER:
        return 'Autre';
      default:
        return taxType;
    }
  };

  // Fonction pour passer au mois précédent
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Fonction pour passer au mois suivant
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Fonction pour revenir au mois actuel
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  // Générer les jours du calendrier
  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Calendrier Fiscal</h3>
      
      {!selectedCountry ? (
        <div className="text-center py-8 text-gray-500">
          Veuillez sélectionner un pays pour afficher le calendrier fiscal.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Navigation du calendrier */}
          <div className="flex justify-between items-center">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="text-center">
              <span className="text-lg font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                onClick={goToCurrentMonth}
                className="ml-2 text-xs text-blue-600 hover:text-blue-800"
              >
                Aujourd'hui
              </button>
            </div>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          {/* Calendrier */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {dayNames.map((day, index) => (
                <div
                  key={index}
                  className="py-2 text-center text-sm font-medium text-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Jours du mois */}
            <div className="grid grid-cols-7 bg-white">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[80px] p-1 border-b border-r border-gray-200 ${
                    day === null ? 'bg-gray-50' : ''
                  }`}
                >
                  {day !== null && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${
                          new Date().getDate() === day &&
                          new Date().getMonth() === currentMonth.getMonth() &&
                          new Date().getFullYear() === currentMonth.getFullYear()
                            ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                            : 'text-gray-700'
                        }`}>
                          {day}
                        </span>
                        {hasDeadlines(day) && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      <div className="mt-1 space-y-1 overflow-y-auto max-h-[50px]">
                        {getDeadlinesForDay(day).map((deadline, idx) => (
                          <div
                            key={idx}
                            className={`text-xs px-1 py-0.5 rounded ${getTaxTypeColor(deadline.taxType)}`}
                            title={deadline.description}
                          >
                            {getTaxTypeName(deadline.taxType)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Légende */}
          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Légende</h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-100 rounded mr-1"></span>
                <span className="text-xs text-gray-700">TVA</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-100 rounded mr-1"></span>
                <span className="text-xs text-gray-700">Impôt sur les sociétés</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-100 rounded mr-1"></span>
                <span className="text-xs text-gray-700">Retenue à la source</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-purple-100 rounded mr-1"></span>
                <span className="text-xs text-gray-700">Charges sociales</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-yellow-100 rounded mr-1"></span>
                <span className="text-xs text-gray-700">Taxe foncière</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-indigo-100 rounded mr-1"></span>
                <span className="text-xs text-gray-700">Patente</span>
              </div>
            </div>
          </div>
          
          {/* Prochaines échéances */}
          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Prochaines échéances</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {deadlines
                .filter(deadline => new Date(deadline.dueDate) >= new Date())
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5)
                .map((deadline, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 border border-gray-200 rounded-lg"
                  >
                    <div className={`w-2 h-full rounded-l-lg ${getTaxTypeColor(deadline.taxType).split(' ')[0]}`}></div>
                    <div className="ml-2 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">
                          {deadline.description}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(deadline.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getTaxTypeColor(deadline.taxType)}`}>
                          {getTaxTypeName(deadline.taxType)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {deadline.filingFrequency === FilingFrequency.MONTHLY ? 'Mensuel' :
                           deadline.filingFrequency === FilingFrequency.QUARTERLY ? 'Trimestriel' :
                           deadline.filingFrequency === FilingFrequency.SEMI_ANNUAL ? 'Semestriel' :
                           'Annuel'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              {deadlines
                .filter(deadline => new Date(deadline.dueDate) >= new Date())
                .length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Aucune échéance à venir.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalendar;
