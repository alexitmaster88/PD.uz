/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' }
    ],
    unoptimized: true
  },
  // Add this if you're deploying to Amplify
  output: 'standalone'
};

module.exports = nextConfig;