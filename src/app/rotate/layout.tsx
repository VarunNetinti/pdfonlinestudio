import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotate PDF Online Free — Fix PDF Page Orientation',
  description: 'Rotate PDF pages online for free. Rotate all pages or a custom range by 90°, 180°, or 270°. Instant download. No sign-up required.',
  keywords: ['rotate PDF', 'rotate PDF pages', 'flip PDF', 'PDF rotation', 'rotate PDF online free', 'fix PDF orientation'],
  alternates: { canonical: 'https://pdfonlinestudio.com/rotate' },
  openGraph: {
    title: 'Rotate PDF Pages Free Online — Fix Orientation Instantly',
    description: 'Rotate all or specific PDF pages by 90°, 180°, or 270°. Free, instant, no account required.',
    url: 'https://pdfonlinestudio.com/rotate',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rotate PDF Pages Free Online — Fix Orientation Instantly' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotate PDF Pages Free Online — Fix Orientation Instantly',
    description: 'Rotate all or specific PDF pages by 90°, 180°, or 270°. Free, instant, no account required.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
