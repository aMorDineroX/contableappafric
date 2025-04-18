import React, { useState } from 'react';

interface AfricanCurrency {
  name: string;
  symbol: string;
  rate: number;
}

const africanCurrencies: Record<string, AfricanCurrency> = {
  'XOF': { name: 'Franc CFA (UEMOA)', symbol: 'CFA', rate: 600 },
  'XAF': { name: 'Franc CFA (CEMAC)', symbol: 'CFA', rate: 600 },
  'NGN': { name: 'Naira nigérian', symbol: '₦', rate: 460 },
  'KES': { name: 'Shilling kenyan', symbol: 'KSh', rate: 110 },
};

const convertCurrency = (amount: number, from: string, to: string): number => {
  if (from === to) return amount;
  const rate = africanCurrencies[to].rate;
  return amount * rate;
};

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const categories = ['all', 'software', 'training', 'bundle'];

  const accountingProducts = [
    {
      id: 1,
      name: "Contafrica Pro",
      price: "299.99",
      currency: "USD",
      description: "Logiciel complet de comptabilité adapté aux normes OHADA",
      features: [
        "Gestion multi-devises africaines",
        "Rapports financiers automatisés",
        "Support SYSCOHADA",
        "Cloud backup"
      ],
      image: "/images/conta-pro.png",
      category: "software"
    },
    {
      id: 2,
      name: "Formation Comptable",
      price: "199.99",
      currency: "USD",
      description: "Formation complète en comptabilité africaine",
      features: [
        "40 heures de vidéo",
        "Certification finale",
        "Support mentor",
        "Cas pratiques"
      ],
      image: "/images/formation.png",
      category: "training"
    },
    {
      id: 3,
      name: "Pack Démarrage PME",
      price: "499.99",
      currency: "USD",
      description: "Solution complète pour PME africaines",
      features: [
        "Logiciel Contafrica Pro",
        "Formation de base",
        "Support 24/7",
        "Migration données"
      ],
      image: "/images/pack-pme.png",
      category: "bundle"
    }
  ];

  const filteredProducts = accountingProducts.filter(product => 
    selectedCategory === 'all' ? true : product.category === selectedCategory
  );

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (selectedCurrency === 'USD') return `${numPrice}`;
    
    const convertedPrice = convertCurrency(numPrice, 'USD', selectedCurrency);
    return `${africanCurrencies[selectedCurrency].symbol} ${convertedPrice.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Nos Solutions Comptables
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
            Des outils professionnels adaptés aux besoins des entreprises africaines
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-8 flex gap-4 mt-8 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Sélecteur de devise */}
        <select 
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="ml-4 p-2 border rounded-lg"
        >
          <option value="USD">USD</option>
          {Object.keys(africanCurrencies).map(currency => (
            <option key={currency} value={currency}>
              {africanCurrencies[currency].name}
            </option>
          ))}
        </select>

        {/* Liste des produits filtrés */}
        <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="p-8">
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                  {product.category}
                </div>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="mt-3 text-gray-500">{product.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <ul className="mt-4 space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-8 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                  Acheter maintenant
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Products;
