import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  // unsafe-inline required: GA4 init inline script + React inline styles
  // unsafe-eval required: Three.js / shader compilation
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://challenges.cloudflare.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",  // Three.js workers
  "frame-src https://challenges.cloudflare.com",  // Turnstile widget
  "frame-ancestors 'none'",   // clickjacking protection (stronger than X-Frame-Options)
  "base-uri 'self'",          // prevent base-tag injection
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy",        value: CSP },
  { key: "X-Frame-Options",               value: "DENY" },
  { key: "X-Content-Type-Options",         value: "nosniff" },
  { key: "X-XSS-Protection",              value: "1; mode=block" },
  { key: "Referrer-Policy",               value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()" },
  { key: "Strict-Transport-Security",     value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control",        value: "on" },
  { key: "Cross-Origin-Opener-Policy",    value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy",  value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      // Old slug → new slug (301 permanent, preserves link equity)
      { source: "/yoga-teachers-training", destination: "/yoga-teacher-training", permanent: true },
      { source: "/yoga-teachers-training/:path*", destination: "/yoga-teacher-training", permanent: true },
      { source: "/200-hours-residential-yoga-teacher-training", destination: "/yoga-teacher-training", permanent: true },
      { source: "/200-hours-residential-yoga-teacher-training/:path*", destination: "/yoga-teacher-training", permanent: true },
      { source: "/200-hours-yoga-teacher-training-non-residential-course", destination: "/yoga-teacher-training", permanent: true },
      { source: "/200-hours-yoga-teacher-training-non-residential-course/:path*", destination: "/yoga-teacher-training", permanent: true },
      { source: "/what-expect-200-hour-residential-yoga-teacher-training-course", destination: "/yoga-teacher-training", permanent: true },
      { source: "/frequently-asked-questions-for-yoga-teacher-training", destination: "/yoga-teacher-training", permanent: true },
      { source: "/sound-healing-therapy-course", destination: "/sound-healing-therapy", permanent: true },
      { source: "/sound-healing-therapy-course/:path*", destination: "/sound-healing-therapy", permanent: true },
      { source: "/foundational-sound-healing-teacher-training-course-level-1", destination: "/sound-healing-therapy", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/about-us/:path*", destination: "/about", permanent: true },
      { source: "/book-a-class", destination: "/class-schedule", permanent: true },
      { source: "/book-a-class/:path*", destination: "/class-schedule", permanent: true },
      { source: "/sessions", destination: "/class-schedule", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:slug*", destination: "/blog/:slug*", permanent: true },
      { source: "/contact/", destination: "/contact", permanent: true },
      { source: "/yoga-teacher-training/", destination: "/yoga-teacher-training", permanent: true },
      { source: "/sound-healing-therapy/", destination: "/sound-healing-therapy", permanent: true },
      { source: "/about/", destination: "/about", permanent: true },
      { source: "/gallery/", destination: "/gallery", permanent: true },
      { source: "/blog/", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
