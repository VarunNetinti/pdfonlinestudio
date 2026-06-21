import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Watermark to PDF Online Free — Text Watermark',
  description: 'Add a custom text watermark to every page of your PDF online. Set opacity, position, font size, and colour. Free, instant, no sign-up.',
  keywords: ['watermark PDF', 'add watermark to PDF', 'PDF watermark online', 'stamp PDF', 'PDF text watermark', 'watermark PDF free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/watermark' },
  openGraph: {
    title: 'Add Watermark to PDF Free — Custom Text & Position',
    description: 'Stamp CONFIDENTIAL, DRAFT, or any custom text on your PDF. Free, no account needed.',
    url: 'https://pdfonlinestudio.com/watermark',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Add Watermark to PDF Free — Custom Text & Position' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add Watermark to PDF Free — Custom Text & Position',
    description: 'Stamp CONFIDENTIAL, DRAFT, or any custom text on your PDF. Free, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
