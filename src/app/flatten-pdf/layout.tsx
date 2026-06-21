import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flatten PDF Online Free — Lock Form Fields & Annotations',
  description: 'Flatten PDF form fields and annotations online for free. Converts interactive form content into static, non-editable text. Essential before archiving. No sign-up.',
  keywords: ['flatten PDF', 'flatten PDF form', 'lock PDF form fields', 'flatten PDF annotations', 'flatten PDF free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/flatten-pdf' },
  openGraph: {
    title: 'Flatten PDF Free Online — Lock Forms & Annotations',
    description: 'Convert interactive PDF forms to static, non-editable content. Free, instant.',
    url: 'https://pdfonlinestudio.com/flatten-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Flatten PDF Free Online — Lock Forms & Annotations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flatten PDF Free Online — Lock Forms & Annotations',
    description: 'Convert interactive PDF forms to static, non-editable content. Free, instant.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
