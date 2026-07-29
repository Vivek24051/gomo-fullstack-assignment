import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local Strapi media (dev default — see apps/cms/config/plugins.ts).
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
    ],
    // Next 16 blocks image optimization from local/private IPs by default (SSRF
    // hardening) — localhost resolves to one, so dev-mode Strapi media needs this
    // explicitly. Not a meaningful risk once deployed: production media comes from
    // Cloudinary's public host, which was never blocked by this check.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
