import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Excel Online Free — Convert PDF Tables to XLSX',
  description: 'Convert PDF tables and data to an editable Excel spreadsheet (.xlsx) online for free. Extract structured data accurately. No sign-up required.',
  keywords: ['PDF to Excel', 'convert PDF to Excel', 'PDF to XLSX', 'PDF table extractor', 'PDF to spreadsheet', 'PDF Excel converter free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/pdf-to-excel' },
  openGraph: {
    title: 'PDF to Excel Free Online — Extract Tables to XLSX',
    description: 'Convert PDF tables to editable Excel spreadsheets. Free, no account required.',
    url: 'https://pdfonlinestudio.com/pdf-to-excel',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF to Excel Free Online — Extract Tables to XLSX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Excel Free Online — Extract Tables to XLSX',
    description: 'Convert PDF tables to editable Excel spreadsheets. Free, no account required.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
