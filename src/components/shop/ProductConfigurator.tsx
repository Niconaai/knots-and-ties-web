'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { clsx } from 'clsx';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type VariantValue = {
  label: string;
  priceModifier: number;
};

type Option = {
  _key: string;
  type: string;
  values: VariantValue[];
};

type ColorVariant = {
  colorName: string;
  colorHex: string;
  images: any[];
};

interface Props {
  productId: string;
  title: string;
  basePrice: number;
  options: Option[];
  variants: ColorVariant[];
  selectedVariantIndex: number;
  onVariantChange: (index: number) => void;
  locale: string;
}

export default function ProductConfigurator({ 
  productId, 
  title, 
  basePrice = 0, 
  options = [], 
  variants = [],
  selectedVariantIndex,
  onVariantChange,
  locale 
}: Props) {
  
  const router = useRouter();
  const { addItem } = useCart();
  const [selections, setSelections] = useState<Record<string, VariantValue>>({});
  const [quantity, setQuantity] = useState(1);

  // 1. AUTO-SELECT DEFAULTS
  // Runs once on mount to select the first option (e.g., "Skinny") automatically.
  useEffect(() => {
    if (Object.keys(selections).length === 0 && options.length > 0) {
      const defaults: Record<string, VariantValue> = {};
      options.forEach(opt => {
        if (opt.values.length > 0) {
          defaults[opt.type] = opt.values[0];
        }
      });
      setSelections(defaults);
    }
  }, [options]); // Depend on options so it runs when data is ready

  const activeVariant = variants[selectedVariantIndex];

  // Calculate Price
  const totalModifiers = Object.values(selections).reduce((acc, curr) => acc + curr.priceModifier, 0);
  const finalPrice = basePrice + totalModifiers;

  const handleSelect = (optionType: string, value: VariantValue) => {
    setSelections((prev) => ({ ...prev, [optionType]: value }));
  };

  const t = {
    addToCart: locale === 'af' ? 'Voeg by Mandjie' : 'Add to Cart',
    total: locale === 'af' ? 'Totaal' : 'Total',
    color: locale === 'af' ? 'Kleur' : 'Color',
    qty: locale === 'af' ? 'Hoeveelheid' : 'Quantity',
    back: locale === 'af' ? 'Terug' : 'Back',
  };

  const handleAddToCart = () => {
    // Safety: If no variant exists (generic product), use "Standard"
    const colorName = activeVariant ? activeVariant.colorName : 'Standard';
    
    // Only show "Color: Green" text if we actually have a variant
    const colorText = activeVariant ? `${t.color}: ${colorName}` : '';

    const techText = Object.entries(selections)
      .map(([key, val]) => `${key}: ${val.label}`)
      .join(', ');
    
    // Combine cleanly, filtering out empty strings
    const finalOptionsText = [colorText, techText].filter(Boolean).join(', ');
    
    // Generate Unique ID: ProductID + ColorName + Options
    const uniqueId = `${productId}-${colorName}-${Object.values(selections).map(v => v.label).join('-')}`;

    const variantImage = activeVariant?.images?.[0] ? activeVariant.images[0] : null;

    addItem({
      id: uniqueId,
      productId,
      title,
      price: finalPrice,
      image: variantImage,
      optionsText: finalOptionsText,
      quantity: quantity,
    });
  };

  return (
    <div className="space-y-8 p-6 bg-white border border-stone-200 shadow-sm mt-8 relative">

      {/* Price Display */}
      <div className="flex justify-between items-baseline border-b border-stone-100 pb-4">
        <span className="text-zinc-500 uppercase tracking-widest text-sm">{t.total}</span>
        {/* Shows Total Price (Unit Price * Quantity) */}
        <span className="text-3xl font-serif text-zinc-900">R {finalPrice * quantity}</span>
      </div>

      {/* Color Variants */}
      {variants.length > 0 && activeVariant && (
        <div className="space-y-3">
           <h4 className="font-serif text-lg text-zinc-900">{t.color}: <span className="text-zinc-500 font-sans text-sm">{activeVariant.colorName}</span></h4>
           <div className="flex flex-wrap gap-3">
             {variants.map((variant, idx) => (
               <button
                 key={variant.colorName}
                 onClick={() => onVariantChange(idx)}
                 className={clsx(
                   "w-8 h-8 rounded-full border border-stone-300 shadow-sm transition-all duration-200",
                   "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900",
                   selectedVariantIndex === idx ? "ring-2 ring-offset-2 ring-zinc-900 scale-110" : "opacity-90"
                 )}
                 style={{ backgroundColor: variant.colorHex }}
                 title={variant.colorName}
               />
             ))}
           </div>
        </div>
      )}

      {/* Options Loop (Width, Style, etc.) */}
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
                    className={clsx(
                      "px-4 py-2 border transition-all duration-200 text-sm",
                      isSelected 
                        ? 'bg-zinc-900 text-stone-50 border-zinc-900' 
                        : 'bg-transparent text-zinc-600 border-zinc-300 hover:border-zinc-900'
                    )}
                  >
                    {val.label} {val.priceModifier > 0 && `(+R${val.priceModifier})`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* NEW: Quantity Picker */}
      <div className="space-y-3">
        <h4 className="font-serif text-lg text-zinc-900">{t.qty}</h4>
        <div className="flex items-center w-32 border border-stone-300">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-stone-100 transition-colors text-zinc-600"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="flex-1 text-center font-medium text-zinc-900">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-stone-100 transition-colors text-zinc-600"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        className="w-full py-4 bg-orange-700 text-white font-bold tracking-widest uppercase hover:bg-zinc-900 transition-colors duration-300"
        onClick={handleAddToCart}
      >
        {t.addToCart}
      </button>
    </div>
  );
}