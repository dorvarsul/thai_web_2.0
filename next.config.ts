import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cxskbzoihnlflurjowms.supabase.co',
        // In newer Next versions, it's safer to include all optional fields as undefined or specific strings
        port: '',
        pathname: '/storage/v1/object/public/**',
        search: '',
      },
    ],
  },
  // If you have other config options (like output: 'standalone'), add them here
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);