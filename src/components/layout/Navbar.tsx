'use client';

import { Link, usePathname } from '@/routing';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Navbar() {
    const t = useTranslations('Navbar');
    const { openCart, items } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Lock Body Scroll when Menu is Open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    return (
        <>
            <header
                className="fixed top-0 w-full z-50 bg-[#fafaf9] border-b border-stone-200 py-3 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-zinc-600">
                        <Link href="/shop" className="hover:text-zinc-900 transition-colors uppercase">{t('shop')}</Link>
                        <Link href="/about" className="hover:text-zinc-900 transition-colors uppercase">{t('story')}</Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-zinc-900 z-50 relative p-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Brand / Logo (Fixed Size) */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2" onClick={() => setIsMenuOpen(false)}>
                        <div className="relative h-14 w-auto overflow-hidden">
                            <Image 
                                src="/logo_hor.png" 
                                alt="Knots of Ties" 
                                width={200} 
                                height={200} 
                                className="object-contain h-full w-auto mix-blend-multiply" 
                                priority
                            />
                        </div>
                    </Link>

                    {/* Cart Trigger */}
                    <button
                        onClick={openCart}
                        className="relative p-2 text-zinc-900 hover:bg-stone-200/50 rounded-full transition-colors group"
                    >
                        <ShoppingBag className="w-6 h-6 group-hover:scale-105 transition-transform" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-in zoom-in border-2 border-[#fafaf9]">
                                {cartCount}
                            </span>
                        )}
                    </button>

                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={clsx(
                "fixed inset-0 bg-[#fafaf9] z-40 flex flex-col justify-center items-center gap-8 text-2xl font-serif text-zinc-900 transition-all duration-500 md:hidden",
                isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-full pointer-events-none"
            )}>
                <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
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