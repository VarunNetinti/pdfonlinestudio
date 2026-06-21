import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word to PDF Online Free — Convert DOCX to PDF',
  description: 'Convert Word documents (.docx, .doc, .odt, .rtf) to PDF online for free. Fonts and layout preserved. No sign-up. Files deleted instantly.',
  keywords: ['Word to PDF', 'convert Word to PDF', 'DOCX to PDF', 'doc to PDF', 'Word PDF converter free', 'convert .docx to PDF'],
  alternates: { canonical: 'https://pdfonlinestudio.com/word-to-pdf' },
  openGraph: {
    title: 'Word to PDF Free Online — DOCX to PDF Conversion',
    description: 'Convert Word .docx files to PDF with fonts and layout preserved. Free, no account.',
    url: 'https://pdfonlinestudio.com/word-to-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Word to PDF Free Online — DOCX to PDF Conversion' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word to PDF Free Online — DOCX to PDF Conversion',
    description: 'Convert Word .docx files to PDF with fonts and layout preserved. Free, no account.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
