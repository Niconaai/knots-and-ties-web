import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation'; // <--- UPDATED IMPORT

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'af'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});

// Lightweight wrappers for navigation APIs
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing); // <--- UPDATED FUNCTION