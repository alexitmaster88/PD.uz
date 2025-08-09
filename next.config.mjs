/* Keep globals.css strictly CSS only. Do not place JS/TS/Next config here. */

const nextConfig = {
  output: 'export', // Enable static exports for Amplify
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' }
    ],
    unoptimized: true
  },
  // Disable server-side features for static deployment
  experimental: {
    appDir: true,
    serverActions: false
  }
};

export default nextConfig;
