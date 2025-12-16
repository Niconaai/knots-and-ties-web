'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { clsx } from 'clsx';

interface Props {
  images: any[];
  title: string;
}

export default function ProductGallery({ images, title }: Props) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    // PARENT:
    // Mobile: flex-col (Stack top/down)
    // Desktop: flex-row (Side-by-side)
    // h-full: Fills the sticky container perfectly
    <div className="flex flex-col lg:flex-row h-full bg-stone-200 pt-24 pb-8 px-4 lg:px-12 gap-6 lg:gap-12 items-start justify-center">
      
      {/* 1. THUMBNAILS (The Navigation) */}
      {/* Mobile: Order 2 (Bottom), Row */}
      {/* Desktop: Order 1 (Left), Column */}
      {images.length > 1 && (
        <div className="order-2 lg:order-1 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto scrollbar-hide shrink-0 z-10">
          {images.map((img, i) => (
            <button
              key={img.asset._id}
              onClick={() => setIndex(i)}
              className={clsx(
                "relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm flex-shrink-0",
                index === i 
                  ? "border-zinc-900 opacity-100 scale-110" 
                  : "border-stone-400 opacity-60 hover:opacity-100 hover:border-zinc-600"
              )}
            >
              <Image
                src={urlFor(img).width(200).height(200).url()}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* 2. MAIN IMAGE (The Stage) */}
      {/* Mobile: Order 1 (Top) */}
      {/* Desktop: Order 2 (Right) */}
      <div className="order-1 lg:order-2 flex-1 w-full flex items-start justify-center lg:h-full">
        
        {/* The Frame */}
        {/* We use max-h to prevent scrollbars. The box will shrink if the screen is short. */}
        <div className="relative w-full max-w-lg shadow-xl bg-white p-3 rounded-sm animate-in zoom-in-95 duration-500">
            {/* Desktop: h-[70vh] max limit to ensure it never overflows the view.
               Mobile: Aspect ratio keeps it sane.
            */}
            <div className="relative w-full aspect-[4/5] lg:h-[65vh] lg:w-auto overflow-hidden bg-stone-50">
                <Image
                  src={urlFor(images[index]).width(1200).url()}
                  alt={`${title} - View ${index + 1}`}
                  fill
                  className="object-contain" // Ensures whole tie fits in box
                  priority
                  key={index}
                />
            </div>
        </div>

      </div>

    </div>
  );
}