import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

const DOMAIN = 'https://pdfonlinestudio.com';
const SITE   = 'PdfOnlineStudio';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f5f0',
};

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: `Free PDF Tools Online — Merge, Split, Compress, Convert | ${SITE}`,
    template: `%s | ${SITE}`,
  },
  description:
    'Free online PDF tools: merge PDFs, split PDF pages, compress file size, convert PDF to Word, Excel, JPG, and more. 27 tools. No sign-up. Files deleted instantly. Works on all devices.',
  keywords: [
    'PDF tools online', 'merge PDF free', 'split PDF online', 'compress PDF',
    'PDF to Word', 'PDF to JPG', 'Word to PDF', 'PDF converter free',
    'PDF editor online', 'reduce PDF size', 'combine PDF files', 'unlock PDF',
    'protect PDF', 'sign PDF online', 'PDF to Excel', 'free PDF tools',
  ],
  authors:   [{ name: SITE, url: DOMAIN }],
  creator:   SITE,
  publisher: SITE,
  robots: {
    index: true, follow: true,
    googleBot: {
      index: true, follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website', locale: 'en_US',
    url: DOMAIN, siteName: SITE,
    title: `Free PDF Tools Online — ${SITE}`,
    description: 'Merge, split, compress and convert PDFs for free. 27 tools. No account needed. Files auto-deleted after processing.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${SITE} — Free PDF Tools` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Free PDF Tools Online — ${SITE}`,
    description: 'Merge, split, compress and convert PDFs for free. 27 tools. No sign-up.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: DOMAIN },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [{ rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  verification: {
    // Add your Google Search Console verification code here:
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
};

/* ── Structured data ──────────────────────────────────────── */
const orgSchema = {
  '@type': 'Organization',
  '@id': `${DOMAIN}/#organization`,
  name: SITE,
  url: DOMAIN,
  logo: { '@type': 'ImageObject', url: `${DOMAIN}/icon-192.png`, width: 192, height: 192 },
  sameAs: [],
};

const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${DOMAIN}/#website`,
  url: DOMAIN,
  name: `${SITE} — Free PDF Tools Online`,
  description: 'Free online PDF tools for everyone. Merge, split, compress, convert, sign, protect, and edit PDFs.',
  publisher: { '@id': `${DOMAIN}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${DOMAIN}/tools?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

const softwareSchema = {
  '@type': 'SoftwareApplication',
  name: `${SITE} PDF Tools`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '2847', bestRating: '5' },
};

const faqSchema = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Are the PDF tools really free?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, all 27 PDF tools on PdfOnlineStudio are completely free. There are no subscriptions, no credits, and no hidden fees.' } },
    { '@type': 'Question', name: 'Is my data safe when using PdfOnlineStudio?',
      acceptedAnswer: { '@type': 'Answer', text: 'Your files are processed in isolated server environments and permanently deleted within 60 seconds of processing. We never store, read, or share your documents.' } },
    { '@type': 'Question', name: 'Do I need to create an account?',
      acceptedAnswer: { '@type': 'Answer', text: 'No account is required. You can use all PDF tools instantly with no sign-up, no email address, and no password.' } },
    { '@type': 'Question', name: 'What file size limit is there?',
      acceptedAnswer: { '@type': 'Answer', text: 'Each file can be up to 100 MB. For merge operations, you can upload up to 20 PDFs at once.' } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical inline CSS — prevents FOUC */}
        <style dangerouslySetInnerHTML={{ __html: `
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth;font-synthesis:none}
          body{background-color:#f7f5f0;color:#1c1a18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
          .skip-link{position:absolute;top:-100%;left:1rem;z-index:10000;background:#1c1a18;color:#fff;padding:8px 16px;border-radius:0 0 12px 12px;font-size:14px;font-weight:500;transition:top 0.15s}
          .skip-link:focus{top:0}
          header{min-height:64px}
        `}} />

        {/* Preload LCP font */}
        <link rel="preload"
          href="https://fonts.gstatic.com/s/fraunces/v31/6NUu8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Bg.woff2"
          as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* Non-blocking fonts */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400&display=swap"
          media="print"
          // @ts-expect-error – onload swap pattern
          onLoad="this.media='all'" />
        <noscript>
          <link rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500&family=DM+Mono:wght@400&display=swap" />
        </noscript>

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={SITE} />

        {/* Structured data — Organization + WebSite + Software + FAQ */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html:
          JSON.stringify({ '@context': 'https://schema.org', '@graph': [orgSchema, websiteSchema, softwareSchema, faqSchema] })
        }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
