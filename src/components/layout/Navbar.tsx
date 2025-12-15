'use client';

import { Link, usePathname } from '@/routing';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl'; // <--- Import

export default function Navbar() {
    const t = useTranslations('Navbar'); // <--- Hook
    const { openCart, items } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // ... (Keep existing useEffects for scroll and body lock) ...
    // Note: I'm omitting the useEffect code here to save space, keep it as it was!

    return (
        <>
            <header className={clsx(/* ... keep existing classes ... */ "fixed top-0 w-full z-50 transition-all duration-300 border-b", isScrolled || isMenuOpen ? "bg-[#fafaf9]/95 backdrop-blur-md border-stone-200 py-4 shadow-sm" : "bg-transparent border-transparent py-6")}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium tracking-wide text-zinc-600">
                        {/* 👇 USE TRANSLATIONS */}
                        <Link href="/shop" className="hover:text-zinc-900 transition-colors uppercase">{t('shop')}</Link>
                        <Link href="/about" className="hover:text-zinc-900 transition-colors uppercase">{t('story')}</Link>
                    </nav>

                    {/* ... (Keep Mobile Button) ... */}
                    <button className="md:hidden text-zinc-900 z-50 relative p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                       {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* ... (Keep Brand Link) ... */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2" onClick={() => setIsMenuOpen(false)}>
                        <span className={clsx("font-serif font-bold text-zinc-900 transition-all duration-300", isScrolled || isMenuOpen ? "text-xl" : "text-2xl md:text-3xl")}>
                            Knots of Ties
                        </span>
                    </Link>

                    {/* ... (Keep Cart Trigger) ... */}
                    <button onClick={openCart} className="relative p-2 text-zinc-900 hover:bg-stone-100 rounded-full transition-colors group">
                        <ShoppingBag className="w-6 h-6 group-hover:scale-105 transition-transform" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-accent-rust text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-in zoom-in">{cartCount}</span>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={clsx("fixed inset-0 bg-[#fafaf9] z-40 flex flex-col justify-center items-center gap-8 text-2xl font-serif text-zinc-900 transition-all duration-500 md:hidden", isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-full pointer-events-none")}>
                <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                {/* 👇 USE TRANSLATIONS */}
                <Link href="/shop" onClick={() => setIsMenuOpen(false)}>{t('shop')}</Link>
                <Link href="/about" onClick={() => setIsMenuOpen(false)}>{t('story')}</Link>
                
                <div className="flex gap-4 text-base font-sans text-zinc-500 mt-8">
                    <Link href={pathname} locale="en" className="hover:text-zinc-900 font-bold">EN</Link>
                    <span className="text-zinc-300">|</span>
                    <Link href={pathname} locale="af" className="hover:text-zinc-900 font-bold">AF</Link>
                </div>
            </div>
        </>
    );
}