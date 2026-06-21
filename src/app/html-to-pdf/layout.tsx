import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTML to PDF Online Free — Convert Web Pages to PDF',
  description: 'Convert HTML files to PDF documents online for free. Upload an .html file and get a clean PDF output. No sign-up. Files deleted instantly.',
  keywords: ['HTML to PDF', 'convert HTML to PDF', 'web page to PDF', 'HTML PDF converter', 'HTML to PDF online free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/html-to-pdf' },
  openGraph: {
    title: 'HTML to PDF Free Online — Convert Web Pages to PDF',
    description: 'Convert HTML files to PDF instantly. Free, no account needed.',
    url: 'https://pdfonlinestudio.com/html-to-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'HTML to PDF Free Online — Convert Web Pages to PDF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML to PDF Free Online — Convert Web Pages to PDF',
    description: 'Convert HTML files to PDF instantly. Free, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
