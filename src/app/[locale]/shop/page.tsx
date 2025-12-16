import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { Link } from "@/routing";
import Image from "next/image";
import { getTranslations } from "next-intl/server"; // <--- Import Server version

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Shop'); // <--- Async fetch
  const products = await sanityFetch({ query: PRODUCTS_QUERY });

  return (
    <main className="min-h-screen px-6 pt-24 md:pt-40 pb-12 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-16 space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-zinc-900">
          {t('title')} {/* <--- Translated */}
        </h1>
        <p className="text-zinc-500 max-w-md mx-auto">
          {t('subtitle')} {/* <--- Translated */}
        </p>
      </div>

      {/* Grid - (Sanity Data handles product titles, but let's check the overlay) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
        {products.map((product: any) => (
          <Link key={product._id} href={`/shop/${product.slug}`} className="group block space-y-4">
            <div className="aspect-[4/5] relative bg-stone-200 overflow-hidden">
              {product.images?.[0] && (
                <Image
                  src={urlFor(product.images[0]).width(500).height(625).url()}
                  alt={product.title?.[locale === 'af' ? 'af' : 'en']}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 {/* Translated View Button */}
                 <span className="bg-white px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-900">{t('view')}</span>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-serif text-lg text-zinc-900">
                {product.title?.[locale === 'af' ? 'af' : 'en']}
              </h3>
              <p className="text-zinc-500 text-sm mt-1">R {product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}