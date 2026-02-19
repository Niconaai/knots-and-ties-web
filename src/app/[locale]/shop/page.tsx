'use client';

import { Link } from "@/routing";
import { useTranslations } from "next-intl";
import { Package, Shirt, Sparkles } from "lucide-react";

export default function ShopPage() {
  const t = useTranslations('Shop');
  const tNav = useTranslations('Navbar');

  const categories = [
    {
      name: tNav('ties'),
      slug: 'ties',
      description: t('tiesSubtitle'),
      icon: Package,
    },
    {
      name: tNav('clothing'),
      slug: 'clothing',
      description: t('clothingSubtitle'),
      icon: Shirt,
    },
    {
      name: tNav('accessories'),
      slug: 'accessories',
      description: t('accessoriesSubtitle'),
      icon: Sparkles,
    },
  ];

  return (
    <main className="min-h-screen px-6 pt-24 md:pt-40 pb-12 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-16 space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-zinc-900">
          {t('title')}
        </h1>
        <p className="text-zinc-500 max-w-md mx-auto">
          {t('homemade')}
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link 
              key={category.slug} 
              href={`/shop/${category.slug}`}
              className="group block bg-stone-50 p-8 hover:bg-stone-100 transition-all duration-300 border border-stone-200"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif text-zinc-900">
                  {category.name}
                </h2>
                <p className="text-zinc-500 text-sm">
                  {category.description}
                </p>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 mt-4 group-hover:underline">
                  {t('view')} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
