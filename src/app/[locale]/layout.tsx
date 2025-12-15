import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { playfair, inter } from '@/app/fonts';
import '../globals.css';
import LanguageModal from '@/components/LanguageModal';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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

          <CartProvider>
            <LanguageModal />
            <CartDrawer />
            <Navbar />

            <div className="pt-24 min-h-screen flex flex-col">
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </div>

          </CartProvider>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}