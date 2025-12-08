import { useTranslations } from 'next-intl';
import { Link } from '@/routing'; // Ensure this points to your routing.ts

export default function HomePage() {
  const t = useTranslations(); 
  // Note: We haven't defined keys in en.json yet, so this might return keys.
  // For now, let's just hardcode text to test the setup.

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="text-sm font-bold tracking-widest text-accent-rust uppercase">
        Est. 2025
      </div>
      <h1 className="text-5xl md:text-7xl font-serif text-ink">
        Knots of Ties
      </h1>
      <p className="text-lg text-ink-light italic">
        Handmade in South Africa.
      </p>
      
      <div className="flex gap-4">
        <Link href="/shop" className="px-6 py-2 bg-ink text-paper hover:bg-ink/90 transition">
          Shop Ties
        </Link>
        <Link href="/about" className="px-6 py-2 border border-ink text-ink hover:bg-stone-200 transition">
          Our Story
        </Link>
      </div>
    </main>
  );
}