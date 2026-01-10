/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Required for msnodesqlv8 (Windows Authentication) to work with Next.js
  // This prevents Next.js from bundling native modules
  experimental: {
    serverComponentsExternalPackages: ['mssql', 'msnodesqlv8'],
  },
  
  // Webpack configuration for native modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle native modules on server side
      config.externals.push('mssql', 'msnodesqlv8');
    }
    return config;
  },
};

module.exports = nextConfig;
