import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCT_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "next-sanity"; // Needs: npm install next-sanity (already done)
import ProductConfigurator from "@/components/shop/ProductConfigurator";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // 1. Fetch the single product
  const product = await sanityFetch({
    query: PRODUCT_QUERY,
    params: { slug }
  });

  //
  //console.log("SANITY PAYLOAD:", JSON.stringify(product, null, 2));

  if (!product) return notFound();

  // Helper for localization
  const title = product.title?.[locale === 'af' ? 'af' : 'en'];
  const story = product.fabricStory?.[locale === 'af' ? 'af' : 'en'];

  return (
    <main className="min-h-screen">
      {/* THE LAYOUT: 
        Desktop: Split screen. Left = Sticky Images. Right = Scrolling Content.
        Mobile: Vertical stack.
      */}
      <div className="lg:grid lg:grid-cols-2">

        {/* LEFT: Visuals (Sticky) */}
        <div className="h-[60vh] lg:h-screen lg:sticky lg:top-0 bg-stone-200 relative overflow-hidden">
          {product.images?.[0] && (
            <Image
              src={urlFor(product.images[0]).width(1000).height(1250).url()}
              alt={title || 'Product'}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* RIGHT: Story & Commerce (Scrollable) */}
        <div className="bg-stone-50 p-8 lg:p-24 flex flex-col justify-center min-h-screen">
          <div className="max-w-xl mx-auto space-y-12">

            {/* Header */}
            <div className="space-y-4 border-b border-zinc-200 pb-8">
              <h1 className="text-5xl lg:text-7xl font-serif text-zinc-900 leading-tight">
                {title}
              </h1>
              <p className="text-zinc-500 italic">
                {locale === 'af' ? 'Handgemaak op bestelling' : 'Handmade to Order'}
              </p>
            </div>

            {/* The Story (Portable Text) */}
            <div className="prose prose-stone prose-lg text-zinc-600 font-sans leading-relaxed">
              {story && <PortableText value={story} />}
              {!story && <p className="italic opacity-50">No story available.</p>}
            </div>

            {/* The Interactive Configurator */}
            <ProductConfigurator
              productId={product._id}           // <--- Pass ID
              title={title || 'Tie'}            // <--- Pass Title
              imageUrl={product.images?.[0] ? urlFor(product.images[0]).width(200).url() : ''} // <--- Pass Image
              basePrice={product.price}
              options={product.options || []}
              locale={locale}
            />

          </div>
        </div>

      </div>
    </main>
  );
}