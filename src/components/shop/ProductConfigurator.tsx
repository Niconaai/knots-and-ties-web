//src/components/shop/ProductConfigurator.tsx

'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { urlFor } from '@/sanity/lib/image';

type VariantValue = {
  label: string;
  priceModifier: number;
};

type Option = {
  _key: string;
  type: string;
  values: VariantValue[];
};

interface Props {
  productId: string;
  title: string;
  imageUrl: string;
  basePrice: number;
  options: Option[];
  locale: string; // 'en' | 'af'
}

export default function ProductConfigurator({ productId, title, imageUrl,
  basePrice = 0, options = [], locale }: Props) {
  const { addItem } = useCart();
  const [selections, setSelections] = useState<Record<string, VariantValue>>({});

  // 1. Calculate Total Price dynamically
  const totalModifiers = Object.values(selections).reduce((acc, curr) => acc + curr.priceModifier, 0);
  const finalPrice = basePrice + totalModifiers;

  // 2. Handle Selection
  const handleSelect = (optionType: string, value: VariantValue) => {
    setSelections((prev) => ({ ...prev, [optionType]: value }));
  };

  const t = {
    addToCart: locale === 'af' ? 'Voeg by Mandjie' : 'Add to Cart',
    select: locale === 'af' ? 'Kies asseblief' : 'Please select',
    total: locale === 'af' ? 'Totaal' : 'Total',
  };

  const handleAddToCart = () => {
    // Construct a readable string of options (e.g. "Width: Skinny, Length: Standard")
    const optionsText = Object.entries(selections)
      .map(([key, val]) => `${key}: ${val.label}`)
      .join(', ');

    // Generate a unique ID for this specific combination
    const uniqueId = `${productId}-${Object.values(selections).map(v => v.label).join('-')}`;

    addItem({
      id: uniqueId,
      productId,
      title,
      price: finalPrice,
      image: imageUrl,
      optionsText: optionsText || 'Standard',
    });
  };

  return (
    <div className="space-y-8 p-6 bg-white border border-stone-200 shadow-sm mt-8">
      {/* Price Display */}
      <div className="flex justify-between items-baseline border-b border-stone-100 pb-4">
        <span className="text-zinc-500 uppercase tracking-widest text-sm">{t.total}</span>
        <span className="text-3xl font-serif text-zinc-900">R {finalPrice}</span>
      </div>

      {/* Options Loop */}
      <div className="space-y-6">
        {options?.map((option) => (
          <div key={option._key} className="space-y-3">
            <h4 className="font-serif text-lg text-zinc-900">{option.type}</h4>
            <div className="flex flex-wrap gap-2">
              {option.values.map((val) => {
                const isSelected = selections[option.type]?.label === val.label;
                return (
                  <button
                    key={val.label}
                    onClick={() => handleSelect(option.type, val)}
                    className={`px-4 py-2 border transition-all duration-200 text-sm ${isSelected
                        ? 'bg-zinc-900 text-stone-50 border-zinc-900'
                        : 'bg-transparent text-zinc-600 border-zinc-300 hover:border-zinc-900'
                      }`}
                  >
                    {val.label} {val.priceModifier > 0 && `(+R${val.priceModifier})`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add to Cart Button */}
      <button
        className="w-full py-4 bg-accent-rust text-white font-bold tracking-widest uppercase hover:bg-zinc-900 transition-colors duration-300"
        onClick={handleAddToCart} 
      >
        {t.addToCart}
      </button>
    </div>
  );
}