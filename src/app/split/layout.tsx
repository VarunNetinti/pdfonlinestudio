import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Split PDF Online Free — Extract & Separate PDF Pages',
  description: 'Split a PDF into individual pages or extract a custom page range. Download each page as a separate PDF in a ZIP archive. Free, instant, no sign-up.',
  keywords: ['split PDF', 'separate PDF pages', 'extract PDF pages', 'PDF splitter', 'split PDF online free', 'PDF page extractor'],
  alternates: { canonical: 'https://pdfonlinestudio.com/split' },
  openGraph: {
    title: 'Split PDF Free Online — Separate Pages in Seconds',
    description: 'Extract individual pages or custom ranges from any PDF. Free and instant with no account required.',
    url: 'https://pdfonlinestudio.com/split',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Split PDF Free Online — Separate Pages in Seconds' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split PDF Free Online — Separate Pages in Seconds',
    description: 'Extract individual pages or custom ranges from any PDF. Free and instant with no account required.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
