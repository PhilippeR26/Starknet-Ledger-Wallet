/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'export',
  // images: {
	// 	unoptimized: true
	// }
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      child_process: false,
    }
    return config;
  }
}

module.exports = nextConfig
