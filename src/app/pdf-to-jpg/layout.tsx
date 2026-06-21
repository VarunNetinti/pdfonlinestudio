import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to JPG Online Free — Convert PDF Pages to Images',
  description: 'Convert PDF pages to high-resolution JPG images online for free. Adjustable DPI from 72 to 300. All pages exported in a ZIP archive. No sign-up.',
  keywords: ['PDF to JPG', 'PDF to image', 'convert PDF to JPG', 'PDF to JPEG', 'PDF page to image', 'PDF to JPG online free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/pdf-to-jpg' },
  openGraph: {
    title: 'PDF to JPG Free Online — High Resolution Export',
    description: 'Convert every PDF page to a JPG image. Adjustable DPI, free, no account needed.',
    url: 'https://pdfonlinestudio.com/pdf-to-jpg',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF to JPG Free Online — High Resolution Export' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to JPG Free Online — High Resolution Export',
    description: 'Convert every PDF page to a JPG image. Adjustable DPI, free, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
