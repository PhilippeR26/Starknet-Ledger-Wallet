/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  // images: {
	// 	unoptimized: true
	// }
  webpack: (config) => { // for starknet-devnet library
    config.resolve.fallback = {
      fs: false,
      net: false,
      child_process: false,
    }
    return config;
  }
}

module.exports = nextConfig
