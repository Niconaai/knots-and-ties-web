'use client';

import { Link, usePathname } from '@/routing';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Menu, X, ChevronDown, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Navbar() {
    const t = useTranslations('Navbar');
    const tAuth = useTranslations('Auth');
    const { openCart, items } = useCart();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
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
                        {/* Shop Dropdown */}
                        <div 
                            className="relative group"
                            onMouseEnter={() => setIsShopDropdownOpen(true)}
                            onMouseLeave={() => setIsShopDropdownOpen(false)}
                        >
                            <button className="hover:text-zinc-900 transition-colors uppercase flex items-center gap-1">
                                {t('shop')}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            <div className={clsx(
                                "absolute top-full left-0 mt-2 bg-white border border-stone-200 shadow-lg min-w-[180px] py-2 transition-all",
                                isShopDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
                            )}>
                                <Link href="/shop/ties" className="block px-4 py-2 hover:bg-stone-100 text-sm uppercase">{t('ties')}</Link>
                                <Link href="/shop/clothing" className="block px-4 py-2 hover:bg-stone-100 text-sm uppercase">{t('clothing')}</Link>
                                <Link href="/shop/accessories" className="block px-4 py-2 hover:bg-stone-100 text-sm uppercase">{t('accessories')}</Link>
                            </div>
                        </div>
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

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-2">
                        {/* Account Dropdown (Desktop) */}
                        <div 
                            className="hidden md:block relative"
                            onMouseEnter={() => setIsAccountDropdownOpen(true)}
                            onMouseLeave={() => setIsAccountDropdownOpen(false)}
                        >
                            <button className="p-2 text-zinc-900 hover:bg-stone-200/50 rounded-full transition-colors">
                                <User className="w-6 h-6" />
                            </button>
                            <div className={clsx(
                                "absolute top-full right-0 mt-2 bg-white border border-stone-200 shadow-lg min-w-[160px] py-2 transition-all",
                                isAccountDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
                            )}>
                                {user ? (
                                    <>
                                        <Link href="/account" className="block px-4 py-2 hover:bg-stone-100 text-sm uppercase">{tAuth('account')}</Link>
                                        <Link href="/admin" className="block px-4 py-2 hover:bg-stone-100 text-sm uppercase">Admin</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="block px-4 py-2 hover:bg-stone-100 text-sm uppercase">{tAuth('login')}</Link>
                                        <Link href="/register" className="block px-4 py-2 hover:bg-stone-100 text-sm uppercase">{tAuth('register')}</Link>
                                    </>
                                )}
                            </div>
                        </div>

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

                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={clsx(
                "fixed inset-0 bg-[#fafaf9] z-40 flex flex-col justify-center items-center gap-8 text-2xl font-serif text-zinc-900 transition-all duration-500 md:hidden",
                isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-full pointer-events-none"
            )}>
                <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <div className="flex flex-col items-center gap-4">
                    <span className="text-xl">{t('shop')}</span>
                    <div className="flex flex-col items-center gap-3 text-lg text-zinc-600">
                        <Link href="/shop/ties" onClick={() => setIsMenuOpen(false)}>{t('ties')}</Link>
                        <Link href="/shop/clothing" onClick={() => setIsMenuOpen(false)}>{t('clothing')}</Link>
                        <Link href="/shop/accessories" onClick={() => setIsMenuOpen(false)}>{t('accessories')}</Link>
                    </div>
                </div>
                <Link href="/about" onClick={() => setIsMenuOpen(false)}>{t('story')}</Link>

                {/* Account Links (Mobile) */}
                {user ? (
                    <>
                        <Link href="/account" onClick={() => setIsMenuOpen(false)}>{tAuth('account')}</Link>
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                    </>
                ) : (
                    <>
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>{tAuth('login')}</Link>
                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>{tAuth('register')}</Link>
                    </>
                )}

                <div className="flex gap-4 text-base font-sans text-zinc-500 mt-8">
                    <Link href={pathname} locale="en" className="hover:text-zinc-900 font-bold">EN</Link>
                    <span className="text-zinc-300">|</span>
                    <Link href={pathname} locale="af" className="hover:text-zinc-900 font-bold">AF</Link>
                </div>
            </div>
        </>
    );
}
