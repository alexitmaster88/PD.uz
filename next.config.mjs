/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type and lint errors fail the build (previously ignored). Run `pnpm typecheck` / `pnpm lint` locally.
  images: {
    unoptimized: true,
  },
  async redirects() {
    // The old /admin page was removed; the admin panel lives at /telc/admin.
    return [{ source: "/admin/:path*", destination: "/telc/admin", permanent: false }]
  },
}

export default nextConfig
