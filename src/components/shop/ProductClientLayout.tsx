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
    // MAIN WRAPPER (Agtergrond)
    <div className="min-h-screen bg-stone-50">
      
      {/* CONTENT CONTAINER */}
      {/* 1. max-w-[1600px] mx-auto: Behou die 'uit-zoom' effek. */}
      {/* 2. VERWYDER 'items-start': Nou stretch die regter kolom weer saam met die linker een. */}
      <div className="lg:grid lg:grid-cols-12 relative max-w-[1600px] mx-auto">
      
        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-8 w-full pt-24 pb-24 px-6 lg:pl-16 lg:pr-12">
           
           <button 
              onClick={() => router.back()} 
              className="lg:hidden flex items-center gap-2 text-zinc-400 mb-6 uppercase text-xs font-bold tracking-widest"
          >
              <ArrowLeft className="w-4 h-4" />
              {locale === 'af' ? 'Terug' : 'Back'}
          </button>

           <ProductGallery 
             images={currentImages} 
             title={`${product.title} - ${activeVariant?.colorName}`} 
           />
        </div>

        {/* RIGHT COLUMN: Sticky Configurator */}
        {/* Hierdie kolom is nou outomaties lank (weens die grid stretch) */}
        <div className="lg:col-span-4 w-full px-6 lg:pl-4 lg:pr-16 pb-12 relative">
           
           {/* STICKY BOX */}
           <div className="sticky top-0 pt-12 lg:top-32 lg:pt-0 space-y-8 h-fit">
              
              <button 
                  onClick={() => router.back()} 
                  className="hidden lg:flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-xs font-bold uppercase tracking-widest"
              >
                  <ArrowLeft className="w-4 h-4" />
                  {locale === 'af' ? 'Terug' : 'Back'}
              </button>

              <div>
                <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-2 leading-tight">
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
    </div>
  );
}