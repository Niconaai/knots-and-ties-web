'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { X, ZoomIn } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  images: any[];
  title: string;
}

export default function ProductGallery({ images, title }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4 w-full">
        {images.map((img, i) => (
          <div 
            key={img.asset._id} 
            className={clsx(
                "relative aspect-[3/4] bg-white cursor-zoom-in group overflow-hidden border border-stone-100 shadow-sm rounded-sm",
                // First 2 images span 2 columns (Big), others span 1 (Small)
                i < 2 ? "col-span-2" : "col-span-1"
            )}
            onClick={() => openLightbox(i)}
          >
            {/* object-contain prevents zooming/cropping */}
            <Image
              src={urlFor(img).width(1000).url()}
              alt={`${title} - View ${i + 1}`}
              fill
              className={clsx(
                  "object-contain transition-transform duration-500 group-hover:scale-105",
                  i < 2 ? "p-6" : "p-2"
              )}
            />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
               <ZoomIn className="text-zinc-400 w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <div 
        className={clsx(
            "fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm transition-all duration-300 flex items-center justify-center",
            isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-zinc-900 transition-colors z-50 shadow-sm"
        >
            <X className="w-6 h-6" />
        </button>

        {isOpen && (
            <div className="relative w-full h-full p-4 md:p-8 flex items-center justify-center" onClick={closeLightbox}>
                <div className="relative w-full h-full max-w-6xl max-h-screen" onClick={(e) => e.stopPropagation()}>
                    <Image
                        src={urlFor(images[photoIndex]).width(1600).url()}
                        alt="Full Screen View"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
        )}
      </div>
    </>
  );
}