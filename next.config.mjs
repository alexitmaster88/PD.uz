/** @type {import('next').NextConfig} */
const nextConfig = {
  // If you truly need static export, keep this; otherwise remove it for SSR on Amplify.
  // output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // add more if needed:
      // { protocol: 'https', hostname: 'cdn.pixabay.com' },
    ],
  },
};

export default nextConfig;
