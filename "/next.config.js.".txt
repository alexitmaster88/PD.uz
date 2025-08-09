/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // add others you use (optional):
      { protocol: 'https', hostname: 'cdn.pixabay.com' }
    ],
    // optional for Amplify/static export to avoid sharp:
    unoptimized: true
  }
};

module.exports = nextConfig;