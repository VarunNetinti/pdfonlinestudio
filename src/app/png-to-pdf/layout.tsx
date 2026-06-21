import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PNG to PDF Online Free — Convert PNG Images to PDF',
  description: 'Convert PNG images to a PDF document online for free. Supports multiple images. Choose A4, Letter, or custom page size. No sign-up required.',
  keywords: ['PNG to PDF', 'convert PNG to PDF', 'PNG image to PDF', 'PNG PDF converter free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/png-to-pdf' },
  openGraph: {
    title: 'PNG to PDF Free Online — Convert PNG Images Instantly',
    description: 'Convert PNG images to PDF. Multiple images supported. Free, no account needed.',
    url: 'https://pdfonlinestudio.com/png-to-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PNG to PDF Free Online — Convert PNG Images Instantly' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to PDF Free Online — Convert PNG Images Instantly',
    description: 'Convert PNG images to PDF. Multiple images supported. Free, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
