/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  // Improve HMR reliability in environments like Docker / WSL
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      // Use polling to detect file changes reliably across mounted filesystems
      poll: 1000,
      // Delay before rebuilding
      aggregateTimeout: 300,
      // Ignore node_modules for performance
      ignored: /node_modules/
    };
    return config;
  }
};

export default nextConfig;


