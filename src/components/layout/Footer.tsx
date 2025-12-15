'use client';

import { Link } from '@/routing';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl'; // <--- Import

export default function Footer() {
  const t = useTranslations('Footer'); // <--- Hook
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-stone-50 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="text-2xl font-serif">Knots of Ties</h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              {t('description')} {/* <--- Translated */}
            </p>
            <div className="flex gap-4">
               {/* Icons stay same */}
               <a href="#" className="hover:text-accent-rust transition"><Instagram className="w-5 h-5" /></a>
               <a href="#" className="hover:text-accent-rust transition"><Facebook className="w-5 h-5" /></a>
               <a href="#" className="hover:text-accent-rust transition"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-2 md:col-start-7 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">{t('shop')}</h4>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li><Link href="/shop" className="hover:text-white transition">{t('allTies')}</Link></li>
              <li><Link href="/shop" className="hover:text-white transition">{t('skinny')}</Link></li>
              <li><Link href="/shop" className="hover:text-white transition">{t('bow')}</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">{t('company')}</h4>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li><Link href="/about" className="hover:text-white transition">{t('story')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">{t('newsletter')}</h4>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t('emailPlaceholder')} 
                className="bg-zinc-800 border-none text-white placeholder-zinc-500 px-4 py-3 focus:ring-1 focus:ring-accent-rust outline-none"
              />
              <button className="bg-stone-50 text-zinc-900 font-bold uppercase text-xs tracking-widest py-3 hover:bg-stone-200 transition">
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
          <p>© {currentYear} Knots of Ties. {t('rights')}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/" className="hover:text-white">{t('privacy')}</Link>
            <Link href="/" className="hover:text-white">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}