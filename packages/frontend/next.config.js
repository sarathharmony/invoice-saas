/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3000'}/api/:path*`,
    },
  ],
};

module.exports = nextConfig;
