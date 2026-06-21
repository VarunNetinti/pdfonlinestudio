import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Protect PDF Online Free — AES-256 Encryption',
  description: 'Add password protection to your PDF with AES-256 encryption. Set open and permission passwords. Free online PDF protector. No sign-up.',
  keywords: ['protect PDF', 'password protect PDF', 'encrypt PDF', 'PDF password', 'PDF security', 'lock PDF', 'protect PDF free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/protect' },
  openGraph: {
    title: 'Password Protect PDF Free — AES-256 Encryption',
    description: 'Lock your PDF with a password using AES-256 encryption. Free, no account required.',
    url: 'https://pdfonlinestudio.com/protect',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Password Protect PDF Free — AES-256 Encryption' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Password Protect PDF Free — AES-256 Encryption',
    description: 'Lock your PDF with a password using AES-256 encryption. Free, no account required.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
