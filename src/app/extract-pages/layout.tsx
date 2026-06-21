import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Extract PDF Pages Online Free — Save Specific Pages',
  description: 'Extract specific pages from a PDF into a new file or separate PDFs. Enter page numbers or ranges. Download as a single PDF or ZIP archive. Free, no sign-up.',
  keywords: ['extract PDF pages', 'PDF page extractor', 'save PDF pages', 'extract pages from PDF free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/extract-pages' },
  openGraph: {
    title: 'Extract PDF Pages Free Online — Save Specific Pages',
    description: 'Pull specific pages from any PDF into a new file. Free, no account needed.',
    url: 'https://pdfonlinestudio.com/extract-pages',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Extract PDF Pages Free Online — Save Specific Pages' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Extract PDF Pages Free Online — Save Specific Pages',
    description: 'Pull specific pages from any PDF into a new file. Free, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
