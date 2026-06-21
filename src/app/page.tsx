import { Suspense, lazy } from 'react';
import type { Metadata } from 'next';
import ToolsGrid from '@/components/tools/ToolsGrid';
import HeroSection from '@/components/ui/HeroSection';
import Link from 'next/link';

const FeaturesSection = lazy(() => import('@/components/ui/FeaturesSection'));
const SeoContent      = lazy(() => import('@/components/ui/SeoContent'));

export const metadata: Metadata = {
  title: 'Free PDF Tools Online — Merge, Split, Compress, Convert | PdfOnlineStudio',
  description:
    'Free online PDF tools: merge multiple PDFs into one, split PDF pages, compress PDF file size, convert PDF to Word, Excel, JPG, and more. 27 tools. No sign-up required. Files deleted instantly after processing.',
  alternates: { canonical: 'https://pdfonlinestudio.com' },
  openGraph: {
    title: 'Free PDF Tools Online — PdfOnlineStudio',
    description: '27 free PDF tools. Merge, split, compress, convert, sign, protect — no account needed.',
    url: 'https://pdfonlinestudio.com',
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* ── Tools section ── */}
      <section className="py-16 px-4 bg-[#f7f5f0]" aria-labelledby="tools-heading">
        <div className="container mx-auto max-w-7xl">

          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest text-amber-700 uppercase mb-3">27 free tools</p>
            <h2 id="tools-heading" className="text-4xl font-display font-semibold text-ink-900 mb-3">
              Everything you need for PDFs
            </h2>
            <p className="text-ink-600 max-w-lg mx-auto">
              Professional-grade PDF tools — free, instant, and private. No installs, no sign-up required.
            </p>
          </div>

          <ToolsGrid />

          {/* CTA below grid */}
          <div className="text-center mt-10">
            <Link href="/tools" className="btn-outline text-sm px-6 py-2.5">
              Browse all 27 tools →
            </Link>
          </div>
        </div>
      </section>

      {/* SEO content */}
      <Suspense fallback={<div className="h-64" />}>
        <SeoContent />
      </Suspense>

      {/* Features */}
      <Suspense fallback={<div className="h-80" />}>
        <FeaturesSection />
      </Suspense>
    </>
  );
}
