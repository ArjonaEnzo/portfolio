/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next's built-in optimizer (/_next/image) stays off: images are already
    // pre-sized WebP in /public or optimized by Cloudinary URL transforms, so
    // it would only add attack surface (it had RCE advisories before 15.5.28)
    // and Vercel image-optimization usage.
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
