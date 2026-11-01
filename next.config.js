/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next's built-in optimizer (/_next/image) is turned off: Next 14 has
    // unpatched RCE advisories there (fixed only in 15.5.28+, which needs
    // React 19). Images are pre-sized WebP in /public or optimized by
    // Cloudinary through URL transforms instead.
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
