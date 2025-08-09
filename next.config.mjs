@tailwind base;
@tailwind components;
@tailwind utilities;

/* Keep globals.css strictly CSS only. Do not place JS/TS/Next config here. */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' }
    ],
    unoptimized: true
  }
};

export default nextConfig;
