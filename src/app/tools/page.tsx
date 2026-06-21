import type { Metadata } from 'next';
import ToolsGrid from '@/components/tools/ToolsGrid';

export const metadata: Metadata = {
  title: 'All Free PDF Tools — Merge, Split, Compress, Convert | PdfOnlineStudio',
  description: '27 free online PDF tools. Merge, split, compress, convert, sign, protect, redact, watermark PDFs and more. No sign-up, no watermarks, files deleted instantly.',
  alternates: { canonical: 'https://pdfonlinestudio.com/tools' },
  openGraph: {
    title: 'All 27 Free PDF Tools — PdfOnlineStudio',
    description: 'Every PDF tool you need. Free, instant, private. No account required.',
    url: 'https://pdfonlinestudio.com/tools',
  },
};

export default function AllToolsPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-100 rounded-full opacity-50 blur-3xl" />
          <div className="absolute bottom-0 -left-16 w-64 h-64 bg-blue-50 rounded-full opacity-40 blur-2xl" />
        </div>
        <div className="container mx-auto max-w-7xl relative text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-amber-800 tracking-wide">Free · No account · Secure</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-display font-semibold text-ink-900 mb-4 leading-tight">
            All PDF Tools
          </h1>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            27 professional-grade tools to merge, split, compress, convert, sign, protect, and edit PDFs.
            Free forever. No sign-up required.
          </p>
        </div>
      </section>

      {/* Tools grid with filters */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          <ToolsGrid showFilters={true} />
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-t border-ink-100 bg-white py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value:'27',    label:'Free tools' },
              { value:'100%',  label:'No cost, ever' },
              { value:'60s',   label:'Auto file deletion' },
              { value:'0',     label:'Sign-ups needed' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-display font-semibold text-ink-900 mb-1">{s.value}</p>
                <p className="text-sm text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
