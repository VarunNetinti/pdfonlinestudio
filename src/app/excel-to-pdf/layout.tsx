import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Excel to PDF Online Free — Convert XLSX to PDF',
  description: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF online for free. Formatting and layout preserved. No sign-up required.',
  keywords: ['Excel to PDF', 'convert Excel to PDF', 'XLSX to PDF', 'spreadsheet to PDF', 'Excel PDF converter free'],
  alternates: { canonical: 'https://pdfonlinestudio.com/excel-to-pdf' },
  openGraph: {
    title: 'Excel to PDF Free Online — XLSX to PDF Conversion',
    description: 'Convert Excel spreadsheets to PDF with formatting preserved. Free, no account.',
    url: 'https://pdfonlinestudio.com/excel-to-pdf',
    siteName: 'PdfOnlineStudio',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Excel to PDF Free Online — XLSX to PDF Conversion' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excel to PDF Free Online — XLSX to PDF Conversion',
    description: 'Convert Excel spreadsheets to PDF with formatting preserved. Free, no account.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
