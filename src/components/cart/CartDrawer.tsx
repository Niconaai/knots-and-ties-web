'use client';

import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { urlFor } from '@/sanity/lib/image';
import { useRouter, usePathname } from 'next/navigation';

export default function CartDrawer() {
  const t = useTranslations('Cart'); // <--- Hook
  const { items, isOpen, closeCart, removeItem, total } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  // Prevent body scroll
  if (typeof window !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-[60] bg-zinc-900/20 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div
        className={clsx(
          "fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[#fafaf9] shadow-2xl transition-transform duration-500 ease-out border-l border-stone-200",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <h2 className="text-2xl font-serif text-zinc-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {t('title')} {/* <--- Translated */}
            </h2>
            <button onClick={closeCart} className="p-2 hover:bg-stone-200 rounded-full transition">
              <X className="w-6 h-6 text-zinc-600" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <ShoppingBag className="w-16 h-16 opacity-20" />
                <p>{t('empty')}</p> {/* <--- Translated */}
                <button
                  onClick={closeCart}
                  className="text-zinc-900 underline underline-offset-4 hover:text-accent-rust"
                >
                  {t('continue')} {/* <--- Translated */}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="relative w-20 h-24 bg-stone-200 flex-shrink-0 border border-stone-200">
                    {item.image && (
                      <Image
                        src={typeof item.image === 'string' ? item.image : urlFor(item.image).width(200).url()}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-zinc-900">{item.title}</h3>
                      <p className="text-xs text-zinc-500 uppercase tracking-wide">{item.optionsText}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 border border-stone-300 px-2 py-1">
                        <span className="text-xs">{t('qty')}: {item.quantity}</span> {/* <--- Translated */}
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-sm">R {item.price * item.quantity}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-400 hover:text-red-600 underline flex items-center gap-1 mt-1 justify-end"
                        >
                          <Trash2 className="w-3 h-3" /> {t('remove')} {/* <--- Translated */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-white space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-zinc-500 uppercase tracking-widest">{t('subtotal')}</span>
                <span className="text-2xl font-serif text-zinc-900">R {total}</span>
              </div>
              <p className="text-xs text-zinc-400 text-center">{t('shippingNote')}</p>

              <button
                className="w-full py-4 bg-zinc-900 text-stone-50 font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors"
                onClick={() => {
                  closeCart()
                  // determine locale from current pathname (/en/..., /af/...)
                  const seg = pathname?.split('/')?.[1] || 'en'
                  router.push(`/${seg}/checkout`)
                }}
              >
                {t('checkout')} {/* <--- Translated */}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}