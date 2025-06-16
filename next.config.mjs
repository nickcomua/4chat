/** @type {import('next').NextConfig} */
const nextConfig = {
  // compress: false,
  sassOptions: {
    additionalData: `$var: red;`,
  },
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
  },
  serverExternalPackages: ['leveldown'],
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/_couchdb/:path*',
        destination: 'http://localhost:5984/:path*',
      },
      {
        source: '/api/_openrouter/:path*',
        destination: 'https://openrouter.ai/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig