/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `swcMinify` removed: SWC minification is the default in Next 16 (key no longer recognised).
  images: {
    // Migrated from the deprecated `images.domains` to `remotePatterns` (Next 16).
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'api.flambeau.local' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
};

module.exports = nextConfig;
