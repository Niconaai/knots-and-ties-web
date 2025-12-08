import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Architect's Note: explicitly pointing to our i18n file
// to fix the "Could not locate request configuration module" error.
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);