import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Word Online Free — Convert PDF to Editable DOCX',
  description: 'Convert PDF to an editable Microsoft Word .docx document online for free. Structure and formatting preserved. No sign-up. Files deleted instantly.',
  keywords: ['PDF to Word', 'convert PDF to Word', 'PDF to DOCX', 'PDF to editable Word', 'PDF Word converter free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/pdf-to-word' },
  openGraph: {
    title: 'PDF to Word Free Online — Editable DOCX Output',
    description: 'Convert PDF to editable Word .docx document. Formatting preserved. Free, no account.',
    url: 'https://pdfonlinestudio.com/pdf-to-word',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF to Word Free Online — Editable DOCX Output' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Word Free Online — Editable DOCX Output',
    description: 'Convert PDF to editable Word .docx document. Formatting preserved. Free, no account.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
