import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionFormData, TransactionType, Category, Tag } from '../../types/transaction';
import { Currency, CURRENCIES } from '../../utils/currencies';
import CurrencySelector from '../CurrencySelector';
import { useCurrency } from '../../contexts/CurrencyContext';
import { CategoryAPI, TagAPI, TransactionAPI } from '../../services/api';
import AttachmentUploader from './AttachmentUploader';

interface TransactionFormProps {
  initialData?: Partial<TransactionFormData> & { id?: number };
  onSubmit?: (data: TransactionFormData) => void;
  isEditing?: boolean;
}

const getDefaultFormData = (currency: Currency): TransactionFormData => ({
  amount: 0,
  type: 'REVENU',
  description: '',
  date: new Date().toISOString().split('T')[0],
  categoryId: 0,
  tagIds: [],
  currency,
  notes: '',
  attachments: []
});

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false
}) => {
  const navigate = useNavigate();
  const { currency: globalCurrency } = useCurrency();
  const [formData, setFormData] = useState<TransactionFormData>({
    ...getDefaultFormData(globalCurrency),
    ...initialData
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>(initialData?.tagIds || []);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    type: 'REVENU',
    color: '#3B82F6'
  });
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTag, setNewTag] = useState<Omit<Tag, 'id'>>({
    name: '',
    color: '#3B82F6'
  });

  // Charger les catégories et tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          CategoryAPI.getAll(),
          TagAPI.getAll()
        ]);
        setCategories(categoriesData);
        setTags(tagsData);

        // Si aucune catégorie n'est sélectionnée et qu'il y a des catégories disponibles
        if (!formData.categoryId && categoriesData.length > 0) {
          const defaultCategory = categoriesData.find(c => c.type === formData.type);
          if (defaultCategory) {
            setFormData(prev => ({ ...prev, categoryId: defaultCategory.id }));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, [formData.type, formData.categoryId]);

  // Filtrer les catégories par type
  const filteredCategories = categories.filter(
    category => category.type === formData.type
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      // Convertir en nombre et valider
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setErrors(prev => ({ ...prev, amount: 'Montant invalide' }));
      } else {
        setErrors(prev => ({ ...prev, amount: '' }));
      }
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else if (name === 'type') {
      // Réinitialiser la catégorie lors du changement de type
      setFormData(prev => ({
        ...prev,
        [name]: value as TransactionType,
        categoryId: 0
      }));
    } else if (name === 'categoryId') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagChange = (tagId: number) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });

    setFormData(prev => ({
      ...prev,
      tagIds: selectedTags.includes(tagId)
        ? selectedTags.filter(id => id !== tagId)
        : [...selectedTags, tagId]
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      return;
    }

    try {
      const createdCategory = await CategoryAPI.create(newCategory);
      setCategories(prev => [...prev, createdCategory]);
      setFormData(prev => ({ ...prev, categoryId: createdCategory.id }));
      setShowNewCategoryForm(false);
      setNewCategory({ name: '', type: 'REVENU', color: '#3B82F6' });
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTag.name) {
      return;
    }

    try {
      const createdTag = await TagAPI.create(newTag);
      setTags(prev => [...prev, createdTag]);
      setSelectedTags(prev => [...prev, createdTag.id]);
      setFormData(prev => ({
        ...prev,
        tagIds: [...(prev.tagIds || []), createdTag.id]
      }));
      setShowNewTagForm(false);
      setNewTag({ name: '', color: '#3B82F6' });
    } catch (error) {
      console.error('Erreur lors de la création du tag:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description) {
      newErrors.description = 'La description est requise';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'La catégorie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Si onSubmit est fourni, utiliser cette fonction
      if (onSubmit) {
        onSubmit(formData);
      } else {
        // Sinon, envoyer directement à l'API
        let transaction;

        if (isEditing && initialData?.id) {
          transaction = await TransactionAPI.update(initialData.id, formData);
        } else {
          transaction = await TransactionAPI.create(formData);
        }

        // Télécharger les pièces jointes si nécessaire
        if (files.length > 0 && transaction.id) {
          await Promise.all(
            files.map(file => TransactionAPI.uploadAttachment(transaction.id, file))
          );
        }

        navigate('/transactions');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Une erreur est survenue lors de la soumission du formulaire'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Modifier la transaction' : 'Nouvelle transaction'}
      </h2>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type de transaction */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              formData.type === 'REVENU'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => handleChange({
              target: { name: 'type', value: 'REVENU' }
            } as React.ChangeEvent<HTMLInputElement>)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full ${
                formData.type === 'REVENU' ? 'bg-green-500' : 'bg-gray-200'
              } mr-3 flex items-center justify-center`}>
                {formData.type === 'REVENU' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">Revenu</p>
                <p className="text-sm text-gray-500">Entrée d'argent</p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              formData.type === 'DEPENSE'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
            onClick={() => handleChange({
              target: { name: 'type', value: 'DEPENSE' }
            } as React.ChangeEvent<HTMLInputElement>)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full ${
                formData.type === 'DEPENSE' ? 'bg-red-500' : 'bg-gray-200'
              } mr-3 flex items-center justify-center`}>
                {formData.type === 'DEPENSE' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">Dépense</p>
                <p className="text-sm text-gray-500">Sortie d'argent</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Montant et devise */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount || ''}
                onChange={handleChange}
                className={`block w-full pr-12 sm:text-sm rounded-md ${
                  errors.amount
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.keys(CURRENCIES).map((code) => (
                    <option key={code} value={code}>
                      {CURRENCIES[code as Currency].symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className={`block w-full sm:text-sm rounded-md ${
                errors.date
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className={`block w-full sm:text-sm rounded-md ${
              errors.description
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Description de la transaction"
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Catégorie */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Catégorie *
            </label>
            <button
              type="button"
              onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showNewCategoryForm ? 'Annuler' : '+ Nouvelle catégorie'}
            </button>
          </div>

          {!showNewCategoryForm ? (
            <>
              <select
                name="categoryId"
                id="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                className={`block w-full sm:text-sm rounded-md ${
                  errors.categoryId
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </>
          ) : (
            <div className="mt-2 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="block w-full sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de la catégorie"
                  />
                </div>
                <div>
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="h-10 w-full rounded-md border-gray-300"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Créer la catégorie
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <button
              type="button"
              onClick={() => setShowNewTagForm(!showNewTagForm)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showNewTagForm ? 'Annuler' : '+ Nouveau tag'}
            </button>
          </div>

          {showNewTagForm && (
            <div className="mt-2 mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    className="block w-full sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du tag"
                  />
                </div>
                <div>
                  <input
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                    className="h-10 w-full rounded-md border-gray-300"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Créer le tag
                </button>
              </div>
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun tag disponible</p>
            ) : (
              tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagChange(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                      : 'bg-gray-100 text-gray-800 border-gray-200 border hover:bg-gray-200'
                  }`}
                  style={tag.color ? {
                    backgroundColor: selectedTags.includes(tag.id) ? `${tag.color}20` : '#f3f4f6',
                    color: selectedTags.includes(tag.id) ? tag.color : '#374151',
                    borderColor: selectedTags.includes(tag.id) ? tag.color : '#e5e7eb'
                  } : undefined}
                >
                  {tag.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Référence */}
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
            Référence
          </label>
          <input
            type="text"
            name="reference"
            id="reference"
            value={formData.reference || ''}
            onChange={handleChange}
            className="block w-full sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Numéro de facture, référence, etc."
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes || ''}
            onChange={handleChange}
            className="block w-full sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Notes ou informations supplémentaires"
          />
        </div>

        {/* Pièces jointes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pièces jointes
          </label>
          <AttachmentUploader
            onFilesChange={handleFileChange}
            maxFiles={5}
            maxSize={5 * 1024 * 1024} // 5MB
            acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx']}
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting
              ? 'Enregistrement...'
              : isEditing
                ? 'Mettre à jour'
                : 'Enregistrer'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
