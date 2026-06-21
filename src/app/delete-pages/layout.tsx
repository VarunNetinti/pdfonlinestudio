import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete PDF Pages Online Free — Remove Pages from PDF',
  description: 'Delete specific pages from a PDF online for free. Enter page numbers or ranges to remove permanently. The remaining pages are saved as a new PDF. No sign-up.',
  keywords: ['delete PDF pages', 'remove pages from PDF', 'PDF page remover', 'delete PDF page online free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/delete-pages' },
  openGraph: {
    title: 'Delete PDF Pages Free Online — Remove Pages Instantly',
    description: 'Remove specific pages from any PDF by page number or range. Free, instant.',
    url: 'https://pdfonlinestudio.com/delete-pages',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Delete PDF Pages Free Online — Remove Pages Instantly' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delete PDF Pages Free Online — Remove Pages Instantly',
    description: 'Remove specific pages from any PDF by page number or range. Free, instant.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
