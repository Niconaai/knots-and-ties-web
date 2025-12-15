import { sanityFetch } from "@/sanity/lib/fetch";
import { HOME_FEATURED_QUERY } from "@/sanity/lib/queries"; // <--- Use new query
import { urlFor } from "@/sanity/lib/image";
import { Link } from "@/routing";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Home');
  
  // We fetch 3 random products to use as visuals for our category "Tiles"
  const featured = await sanityFetch({ query: HOME_FEATURED_QUERY });

  return (
    <main className="min-h-screen bg-stone-50">
      
      {/* 1. THE ARCHWAY (Hero Section) */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image - Ideally a lifestyle shot. Using the first product as placeholder for now */}
        {featured[0]?.images?.[0] && (
           <div className="absolute inset-0">
             <Image
               src={urlFor(featured[0].images[0]).width(1200).url()}
               alt="Hero Background"
               fill
               className="object-cover opacity-90"
               priority
             />
             {/* The "Warmth" Filter - Adds that Spanish Afternoon glow */}
             <div className="absolute inset-0 bg-stone-900/30 mix-blend-multiply" />
           </div>
        )}

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 p-6 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-serif text-stone-50 drop-shadow-lg leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-stone-200 font-light tracking-wide">
            {t('heroSubtitle')}
          </p>
          
          <Link 
            href="/shop" 
            className="inline-block bg-accent-rust text-white px-10 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-zinc-900 transition-colors duration-300"
          >
            {t('cta')}
          </Link>
        </div>
      </section>


      {/* 2. THE TILES (Category Navigation) */}
      {/* This grid mimics the tiled floor of a courtyard. Structured, square, elegant. */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Tile 1: Skinny */}
          <Link href="/shop" className="group relative aspect-[3/4] overflow-hidden bg-stone-200 block">
            {featured[0]?.images?.[0] && (
              <Image 
                src={urlFor(featured[0].images[0]).width(600).url()} 
                alt="Skinny"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-serif text-white tracking-widest uppercase border-b border-transparent group-hover:border-white transition-all pb-1">
                {t('cat_skinny')}
              </h3>
            </div>
          </Link>

          {/* Tile 2: Standard (Middle - usually the largest or central in a courtyard, here equal) */}
          <Link href="/shop" className="group relative aspect-[3/4] overflow-hidden bg-stone-200 block md:-mt-12 shadow-xl z-10">
            {featured[1]?.images?.[0] && (
              <Image 
                src={urlFor(featured[1].images[0]).width(600).url()} 
                alt="Standard"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-serif text-white tracking-widest uppercase border-b border-transparent group-hover:border-white transition-all pb-1">
                {t('cat_standard')}
              </h3>
            </div>
          </Link>

          {/* Tile 3: Bow Ties */}
          <Link href="/shop" className="group relative aspect-[3/4] overflow-hidden bg-stone-200 block">
            {featured[2]?.images?.[0] ? (
              <Image 
                src={urlFor(featured[2].images[0]).width(600).url()} 
                alt="Bow"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
                // Fallback if we only have 2 products
                <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500">Coming Soon</div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-serif text-white tracking-widest uppercase border-b border-transparent group-hover:border-white transition-all pb-1">
                {t('cat_bow')}
              </h3>
            </div>
          </Link>

        </div>
      </section>


      {/* 3. THE VERANDA (The Brand Story Invitation) */}
      <section className="bg-zinc-900 text-stone-50 py-32 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <span className="text-accent-rust uppercase tracking-[0.3em] text-xs font-bold">
            Knots of Ties
          </span>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight">
            {t('storyTitle')}
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
            {t('storyExcerpt')}
          </p>
          <div className="pt-8">
            <Link 
              href="/about" 
              className="border-b border-stone-600 pb-1 hover:text-accent-rust hover:border-accent-rust transition-colors duration-300"
            >
              {t('readMore')}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}