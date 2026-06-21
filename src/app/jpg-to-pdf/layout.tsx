import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JPG to PDF Online Free — Convert Images to PDF',
  description: 'Convert JPG, PNG, or WEBP images to a PDF document online for free. Combine multiple images. Choose A4, Letter, or fit-to-image page size. No sign-up.',
  keywords: ['JPG to PDF', 'image to PDF', 'convert JPG to PDF', 'photos to PDF', 'JPEG to PDF', 'JPG to PDF online free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/jpg-to-pdf' },
  openGraph: {
    title: 'JPG to PDF Free Online — Images to PDF Instantly',
    description: 'Convert JPG, PNG, and WEBP images to PDF. Combine multiple images. Free, no account.',
    url: 'https://pdfonlinestudio.com/jpg-to-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'JPG to PDF Free Online — Images to PDF Instantly' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to PDF Free Online — Images to PDF Instantly',
    description: 'Convert JPG, PNG, and WEBP images to PDF. Combine multiple images. Free, no account.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
