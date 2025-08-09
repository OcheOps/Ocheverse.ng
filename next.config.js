/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',       // Makes a smaller runtime bundle
  images: {
    unoptimized: false        // Enables sharp for image optimization
  }
};

module.exports = nextConfig;
