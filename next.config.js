// Static pages can't carry a per-request nonce, so scripts keep
// 'unsafe-inline' (theme script, JSON-LD, Next's inline chunks). The CSP still
// blocks plugins, <base> hijacking, foreign form targets and framing.
// 'wasm-unsafe-eval' allows WebAssembly only (drei's meshopt GLTF decoder),
// not JS eval.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self' blob: data:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // The 3D room used to live at /desk before it became the home page.
  async redirects() {
    return [{ source: "/desk", destination: "/", permanent: true }];
  },
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
