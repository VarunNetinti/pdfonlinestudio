import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Page Numbers to PDF Online Free — Custom Numbering',
  description: 'Stamp page numbers on your PDF online for free. Choose position (6 options), format (1, i, a, I), starting number, and font size. No sign-up.',
  keywords: ['add page numbers to PDF', 'PDF page numbers', 'number PDF pages', 'PDF pagination', 'page numbering PDF free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/page-numbers' },
  openGraph: {
    title: 'Add Page Numbers to PDF Free — 6 Positions, 4 Formats',
    description: 'Add customisable page numbers to any PDF. Set position, format and starting number. Free.',
    url: 'https://pdfonlinestudio.com/page-numbers',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Add Page Numbers to PDF Free — 6 Positions, 4 Formats' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add Page Numbers to PDF Free — 6 Positions, 4 Formats',
    description: 'Add customisable page numbers to any PDF. Set position, format and starting number. Free.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
