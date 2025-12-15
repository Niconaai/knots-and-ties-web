import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// 1. Configure Internationalization
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // 2. Enable Styled Components for Sanity
  compiler: {
    styledComponents: true,
  },
  // 3. Allow Sanity Images (We will need this for the frontend later)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default withNextIntl(nextConfig);