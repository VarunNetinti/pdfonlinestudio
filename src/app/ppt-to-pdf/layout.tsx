import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PowerPoint to PDF Online Free — Convert PPTX to PDF',
  description: 'Convert PowerPoint presentations (.pptx, .ppt, .odp) to PDF online for free. All slides preserved. No sign-up required.',
  keywords: ['PowerPoint to PDF', 'PPT to PDF', 'PPTX to PDF', 'convert PowerPoint to PDF', 'presentation to PDF free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/ppt-to-pdf' },
  openGraph: {
    title: 'PowerPoint to PDF Free Online — PPTX to PDF',
    description: 'Convert PowerPoint slides to PDF. All slides and formatting preserved. Free.',
    url: 'https://pdfonlinestudio.com/ppt-to-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PowerPoint to PDF Free Online — PPTX to PDF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PowerPoint to PDF Free Online — PPTX to PDF',
    description: 'Convert PowerPoint slides to PDF. All slides and formatting preserved. Free.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
