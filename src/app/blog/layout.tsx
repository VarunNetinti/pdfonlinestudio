import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'PDF Guides & Tutorials',
    template: '%s | PdfOnlineStudio PDF Guides',
  },
  alternates: { canonical: 'https://pdfonlinestudio.com/blog' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
