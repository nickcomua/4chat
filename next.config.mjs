/** @type {import('next').NextConfig} */
const nextConfig = {
  // compress: false,
  sassOptions: {
    // additionalData: `$var: red;`,
  },
  output: 'standalone',
  experimental: {
    reactCompiler: true,
    // serverComponentsHmrCache: false,
    nodeMiddleware: true,
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
  // serverExternalPackages: ['pouchdb'],
}

export default nextConfig