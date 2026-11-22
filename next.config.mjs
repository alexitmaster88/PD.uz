/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type and lint errors fail the build (previously ignored). Run `pnpm typecheck` / `pnpm lint` locally.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
