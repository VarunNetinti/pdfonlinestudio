import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress PDF Online Free — Reduce PDF File Size Up to 70%',
  description: 'Compress PDF files online to reduce file size by up to 70%. Three quality levels: low, medium, high. No sign-up. No watermarks. Files deleted instantly.',
  keywords: ['compress PDF', 'reduce PDF file size', 'PDF compressor', 'shrink PDF', 'compress PDF online free', 'reduce PDF size', 'PDF size reducer'],
  alternates: { canonical: 'https://pdfonlinestudio.com/compress' },
  openGraph: {
    title: 'Compress PDF Free — Reduce File Size Up to 70%',
    description: 'Compress PDF files online with three quality levels. No watermarks, no account needed.',
    url: 'https://pdfonlinestudio.com/compress',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Compress PDF Free — Reduce File Size Up to 70%' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF Free — Reduce File Size Up to 70%',
    description: 'Compress PDF files online with three quality levels. No watermarks, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
