/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: "export",
  basePath: isProd ? '/aeterna1004.github.io' : '',
  assetPrefix: isProd ? '/aeterna1004.github.io/' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
