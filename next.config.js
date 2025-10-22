/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // This is only for the adapter type issue - remove once NextAuth v5 is stable
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
