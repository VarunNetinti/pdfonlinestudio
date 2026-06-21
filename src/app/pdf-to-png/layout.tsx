import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to PNG Online Free — Lossless PDF Page Conversion',
  description: 'Convert PDF pages to lossless PNG images online for free. Supports transparent background. All pages exported as a ZIP archive. No sign-up.',
  keywords: ['PDF to PNG', 'convert PDF to PNG', 'PDF page to PNG', 'PDF to image PNG', 'PDF to PNG online free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/pdf-to-png' },
  openGraph: {
    title: 'PDF to PNG Free Online — Lossless Image Export',
    description: 'Convert PDF pages to lossless PNG images. Transparent background support. Free.',
    url: 'https://pdfonlinestudio.com/pdf-to-png',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF to PNG Free Online — Lossless Image Export' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to PNG Free Online — Lossless Image Export',
    description: 'Convert PDF pages to lossless PNG images. Transparent background support. Free.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
