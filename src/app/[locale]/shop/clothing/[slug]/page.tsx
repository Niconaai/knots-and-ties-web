import { sanityFetch } from "@/sanity/lib/fetch";
import { PRODUCT_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import ProductClientLayout from "@/components/shop/ProductClientLayout"; // <--- Import Wrapper

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  
  // Fetch Data
  const product = await sanityFetch({ 
    query: PRODUCT_QUERY, 
    params: { slug } 
  });

  if (!product) {
    notFound();
  }

  // Extract localized title
  const title = product.title?.[locale === 'af' ? 'af' : 'en'] || product.title?.en;

  // Prepare a clean product object to pass down
  const productData = {
    ...product,
    title: title, // Override complex title object with string
  };

  return (
    <main className="min-h-screen">
      {/* Handover to Client Component */}
      <ProductClientLayout product={productData} locale={locale} />
    </main>
  );
}