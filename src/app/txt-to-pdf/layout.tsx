import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TXT to PDF Online Free — Convert Text Files to PDF',
  description: 'Convert plain text files (.txt, .md, .csv) to a clean, paginated PDF document online for free. Automatic line wrapping and page breaks. No sign-up.',
  keywords: ['TXT to PDF', 'text to PDF', 'convert TXT to PDF', 'markdown to PDF', 'plain text to PDF free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/txt-to-pdf' },
  openGraph: {
    title: 'TXT to PDF Free Online — Text to PDF Conversion',
    description: 'Convert .txt, .md, and .csv files to PDF. Clean formatting, free, no account.',
    url: 'https://pdfonlinestudio.com/txt-to-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TXT to PDF Free Online — Text to PDF Conversion' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TXT to PDF Free Online — Text to PDF Conversion',
    description: 'Convert .txt, .md, and .csv files to PDF. Clean formatting, free, no account.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
