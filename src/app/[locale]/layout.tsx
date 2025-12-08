import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { playfair, inter } from '@/app/fonts'; // Import from step 4A
import '../globals.css'; 

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
 
  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}