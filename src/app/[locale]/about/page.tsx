import { getTranslations } from "next-intl/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('About');
  const settings = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  
  const heroImage = settings?.aboutHero?.image;
  const heroAlt = settings?.aboutHero?.imageAlt?.[locale] || 'About Knots & Ties';

  return (
    <main className="min-h-screen">
      
      {/* Hero */}
      <section className="relative h-[60vh] bg-stone-200 flex items-center justify-center overflow-hidden">
        {heroImage && (
          <Image
            src={urlFor(heroImage).width(1920).url()}
            alt={heroAlt}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-zinc-900/10 z-10" /> 
        <div className="relative z-20 text-center space-y-6 px-6">
          <h1 className="text-5xl md:text-7xl font-serif text-zinc-900">{t('title')}</h1>
          <p className="text-lg md:text-xl text-zinc-700 italic font-medium">{t('subtitle')}</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-24 space-y-8 text-lg text-zinc-600 leading-relaxed">
        <p>
          <span className="text-4xl float-left mr-4 mt-[-10px] font-serif text-zinc-900">K</span>
          {t('p1')}
        </p>
        <p>{t('p2')}</p>
        
        <div className="pt-12 border-t border-zinc-200 mt-12">
           <h3 className="font-serif text-2xl text-zinc-900 mb-4">{t('promiseTitle')}</h3>
           <p>{t('promiseText')}</p>
        </div>
      </section>

    </main>
  );
}