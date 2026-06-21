import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crop PDF Online Free — Trim PDF Margins',
  description: 'Crop PDF pages online for free by trimming margins on each side. Set top, right, bottom, and left crop amounts as a percentage. Applied to all pages. No sign-up.',
  keywords: ['crop PDF', 'trim PDF margins', 'PDF margin crop', 'crop PDF pages online free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/crop-pdf' },
  openGraph: {
    title: 'Crop PDF Free Online — Trim Margins from All Pages',
    description: 'Crop PDF margins by percentage on each side. Applied to all pages. Free.',
    url: 'https://pdfonlinestudio.com/crop-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Crop PDF Free Online — Trim Margins from All Pages' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crop PDF Free Online — Trim Margins from All Pages',
    description: 'Crop PDF margins by percentage on each side. Applied to all pages. Free.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
