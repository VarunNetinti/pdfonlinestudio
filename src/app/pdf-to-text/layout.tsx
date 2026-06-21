import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Text Online Free — Extract Text from PDF',
  description: 'Extract all readable text from a PDF and download as a .txt or Markdown file. Fast, free, no sign-up. Works on all text-based PDFs.',
  keywords: ['PDF to text', 'extract text from PDF', 'PDF text extractor', 'convert PDF to TXT', 'PDF to markdown free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/pdf-to-text' },
  openGraph: {
    title: 'PDF to Text Free Online — Extract PDF Content',
    description: 'Extract text from any PDF instantly. Download as .txt or Markdown. Free.',
    url: 'https://pdfonlinestudio.com/pdf-to-text',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF to Text Free Online — Extract PDF Content' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Text Free Online — Extract PDF Content',
    description: 'Extract text from any PDF instantly. Download as .txt or Markdown. Free.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
