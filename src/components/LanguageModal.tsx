'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from '@/routing'; 
import Cookies from 'js-cookie'; 

export default function LanguageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hasConsent = Cookies.get('NEXT_LOCALE');
    if (!hasConsent) {
      setIsOpen(true);
    }
  }, []);

  const handleSelect = (locale: 'en' | 'af') => {
    Cookies.set('NEXT_LOCALE', locale, { expires: 365 });
    
    setIsOpen(false);

    router.replace(pathname, { locale });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-50/95 backdrop-blur-sm p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
        
        {/* Brand Logo or Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-zinc-900">Knots of Ties</h2>
          <p className="text-zinc-600 italic">Taalvoorkeur / Language Preference</p>
        </div>

        {/* Buttons */}
        <div className="grid gap-4">
          <button
            onClick={() => handleSelect('af')}
            className="w-full py-4 border-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all uppercase tracking-widest font-bold"
          >
            Afrikaans
          </button>

          <button
            onClick={() => handleSelect('en')}
            className="w-full py-4 border-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all uppercase tracking-widest font-bold"
          >
            English
          </button>
          
        </div>
        
      </div>
    </div>
  );
}