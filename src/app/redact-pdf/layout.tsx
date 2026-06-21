import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redact PDF Online Free — Permanently Black Out Content',
  description: 'Permanently redact sensitive content from PDF pages online for free. Draw black redaction boxes over text, images, or data before sharing. No sign-up.',
  keywords: ['redact PDF', 'PDF redaction', 'black out PDF text', 'PDF content removal', 'redact PDF online free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/redact-pdf' },
  openGraph: {
    title: 'Redact PDF Free Online — Black Out Sensitive Content',
    description: 'Permanently black out sensitive PDF content. Free, no account needed.',
    url: 'https://pdfonlinestudio.com/redact-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Redact PDF Free Online — Black Out Sensitive Content' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redact PDF Free Online — Black Out Sensitive Content',
    description: 'Permanently black out sensitive PDF content. Free, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
