import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing'; // <--- Import the single source of truth

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  // We use `routing.locales` here so it never goes out of sync with middleware
  if (!locale || !routing.locales.includes(locale as any)) {
    notFound();
  }

  return {
    locale, 
    messages: (await import(`./messages/${locale}.json`)).default
  };
});