/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  // DO NOT use output: 'export' since the app relies on dynamic routes/SSR on Amplify
};

export default nextConfig;