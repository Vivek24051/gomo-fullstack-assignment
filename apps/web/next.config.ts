import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local Strapi media (dev default — see apps/cms/config/plugins.ts).
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
