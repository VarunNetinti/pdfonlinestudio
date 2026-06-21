import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unlock PDF Online Free — Remove PDF Password Protection',
  description: 'Remove password protection from a PDF you own. Enter the password to decrypt and download an unlocked PDF instantly. Free, no sign-up.',
  keywords: ['unlock PDF', 'remove PDF password', 'decrypt PDF', 'PDF unlocker', 'unlock PDF online free', 'PDF password remover'],
  alternates: { canonical: 'https://pdfonlinestudio.com/unlock' },
  openGraph: {
    title: 'Unlock PDF Free Online — Remove Password Instantly',
    description: 'Remove PDF password protection instantly. Free, no account needed.',
    url: 'https://pdfonlinestudio.com/unlock',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Unlock PDF Free Online — Remove Password Instantly' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlock PDF Free Online — Remove Password Instantly',
    description: 'Remove PDF password protection instantly. Free, no account needed.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
