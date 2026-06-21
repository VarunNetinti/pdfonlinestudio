import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online Free — Combine PDFs Instantly',
  description: 'Merge multiple PDF files into one document online for free. Drag and drop up to 20 PDFs, reorder pages, and download in seconds. No sign-up. No watermarks.',
  keywords: ['merge PDF', 'combine PDF files', 'join PDF online', 'merge PDF free', 'PDF merger', 'combine PDFs', 'PDF joiner', 'merge PDF documents'],
  alternates: { canonical: 'https://pdfonlinestudio.com/merge' },
  openGraph: {
    title: 'Merge PDF Files Free — Combine Up to 20 PDFs Online',
    description: 'Drag, drop and merge multiple PDFs into one file instantly. Free, no watermarks, no account needed.',
    url: 'https://pdfonlinestudio.com/merge',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Merge PDF Files Free — Combine Up to 20 PDFs Online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge PDF Files Free — Combine Up to 20 PDFs Online',
    description: 'Drag, drop and merge multiple PDFs into one file instantly. Free, no watermarks, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
