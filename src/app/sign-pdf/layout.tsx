import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign PDF Online Free — Add Signature to PDF',
  description: 'Add a typed or image signature to any PDF page online for free. Position your signature anywhere on the page. No account, no watermarks, fully secure.',
  keywords: ['sign PDF', 'PDF signature', 'add signature to PDF', 'electronic signature PDF', 'sign PDF online free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/sign-pdf' },
  openGraph: {
    title: 'Sign PDF Free Online — Add Electronic Signature',
    description: 'Add a typed or uploaded signature to any PDF. Free, no account, no watermarks.',
    url: 'https://pdfonlinestudio.com/sign-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sign PDF Free Online — Add Electronic Signature' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign PDF Free Online — Add Electronic Signature',
    description: 'Add a typed or uploaded signature to any PDF. Free, no account, no watermarks.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
