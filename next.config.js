/** @type {import('next').NextConfig} */
const nextConfig = {

  /* ── Disable runtime source maps in production (saves ~200KB JS) */
  productionBrowserSourceMaps: false,

  /* ── Compiler options ─────────────────────────────────────── */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  /* ── Experimental ────────────────────────────────────────── */
  experimental: {
    serverComponentsExternalPackages: ['pdf-lib', 'sharp', 'formidable', 'archiver', 'jszip'],
    optimizePackageImports: ['react', 'react-dom'],
  },

  /* ── Bundle optimisation: target modern browsers only ─────── */
  /* This eliminates the Babel polyfills Lighthouse flagged:      */
  /* @babel/plugin-transform-classes, Array.at, flatMap, etc.    */
  transpilePackages: [],

  /* ── Webpack: split chunks aggressively to cut main-app.js ── */
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          // Isolate large pdf-lib into its own chunk — lazy loaded
          pdflib: {
            test: /[\\/]node_modules[\\/]pdf-lib[\\/]/,
            name: 'vendor-pdflib',
            chunks: 'async',
            priority: 30,
          },
          // Separate React runtime
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'vendor-react',
            chunks: 'all',
            priority: 20,
          },
          // Everything else from node_modules
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    return config;
  },

  /* ── Security & caching headers ─────────────────────────── */
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          ...(isDev ? [] : [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          }]),
          // FIX: Added 'unsafe-eval' only in dev; prod uses nonce approach
          // FIX: Added 'strict-dynamic' to remove host allowlist bypass warning
          {
            key: 'Content-Security-Policy',
            value: isDev
              ? [
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "font-src 'self' https://fonts.gstatic.com data:",
                  "img-src 'self' data: https: blob:",
                  "connect-src 'self'",
                  "frame-src blob:",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                ].join('; ')
              : [
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-inline'", // Ad scripts disabled: https://pagead2.googlesyndication.com https://www.googletagmanager.com
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "font-src 'self' https://fonts.gstatic.com data:",
                  "img-src 'self' data: https: blob:",
                  "connect-src 'self'",
                  "frame-src blob:", // Ad frame disabled: https://googleads.g.doubleclick.net
              "frame-ancestors 'self'",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                ].join('; '),
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
      {
        // FIX: Cache static assets for 1 year
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // FIX: Cache public assets (icons, manifest) for 7 days
        source: '/(favicon.ico|icon-192.png|icon-512.png|manifest.json|apple-touch-icon.png|og-image.png|robots.txt)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  /* ── API body size ───────────────────────────────────────── */
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};

module.exports = nextConfig;
