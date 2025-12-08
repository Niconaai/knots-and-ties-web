import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { playfair, inter } from '@/app/fonts'; 
import '../globals.css'; 
import LanguageModal from '@/components/LanguageModal'; // <--- Import

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
 
  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LanguageModal /> {/* <--- Mount here. It handles its own visibility. */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}