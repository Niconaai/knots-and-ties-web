import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations('About');

  return (
    <main className="min-h-screen">
      
      {/* Hero */}
      <section className="relative h-[60vh] bg-stone-200 flex items-center justify-center overflow-hidden">
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