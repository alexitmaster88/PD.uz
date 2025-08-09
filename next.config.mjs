/* Keep globals.css strictly CSS only. Do not place JS/TS/Next config here. */

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
