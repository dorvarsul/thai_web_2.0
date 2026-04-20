import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cxskbzoihnlflurjowms.supabase.co', // Your specific project ID
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
