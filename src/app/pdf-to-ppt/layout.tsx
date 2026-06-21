import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to PowerPoint Online Free — Convert PDF to PPTX',
  description: 'Convert PDF slides and documents to editable PowerPoint .pptx presentations online for free. Each page becomes a slide. No sign-up.',
  keywords: ['PDF to PowerPoint', 'PDF to PPT', 'convert PDF to PPTX', 'PDF to slides', 'PDF presentation converter free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/pdf-to-ppt' },
  openGraph: {
    title: 'PDF to PowerPoint Free Online — Editable PPTX',
    description: 'Convert PDF to editable PowerPoint presentations. Free, no account needed.',
    url: 'https://pdfonlinestudio.com/pdf-to-ppt',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF to PowerPoint Free Online — Editable PPTX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to PowerPoint Free Online — Editable PPTX',
    description: 'Convert PDF to editable PowerPoint presentations. Free, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
