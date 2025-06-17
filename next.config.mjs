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
}

export default nextConfig