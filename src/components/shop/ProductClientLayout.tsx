'use client';

import { useState } from 'react';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductConfigurator from '@/components/shop/ProductConfigurator';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Props {
  product: any;
  locale: string;
}

export default function ProductClientLayout({ product, locale }: Props) {
  const router = useRouter();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIndex];
  const currentImages = activeVariant?.images || [];

  return (
    <div className="lg:grid lg:grid-cols-2">
      
      {/* LEFT: Gallery */}
      <div className="h-[60vh] lg:h-screen lg:sticky lg:top-0 bg-stone-200 relative">
         <ProductGallery 
           images={currentImages} 
           title={`${product.title} - ${activeVariant?.colorName}`} 
         />
      </div>

      {/* RIGHT: Text & Configurator */}
      {/* UPDATED PADDING: Reduced from lg:p-24 to lg:p-12 */}
      <div className="bg-stone-50 p-6 lg:p-12 flex flex-col justify-center min-h-screen pt-24">
         
         <div className="max-w-md mx-auto w-full space-y-8">
            
            {/* Back Button */}
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-xs font-bold uppercase tracking-widest mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                {locale === 'af' ? 'Terug' : 'Back'}
            </button>

            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-2">
                {product.title}
              </h1>
              <p className="text-xl text-zinc-500 font-light">R {product.price}</p>
            </div>

            <div className="prose prose-stone text-zinc-600">
               <p>{locale === 'af' ? 'Handgemaak in Suid-Afrika.' : 'Handmade in South Africa.'}</p>
            </div>

            <ProductConfigurator 
              productId={product._id}
              title={product.title}
              basePrice={product.price}
              options={product.options || []}
              variants={variants}
              selectedVariantIndex={selectedVariantIndex}
              onVariantChange={setSelectedVariantIndex}
              locale={locale}
            />
         </div>

      </div>

    </div>
  );
}