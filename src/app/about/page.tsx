import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About PdfOnlineStudio — Free PDF Tools Online',
  description: 'PdfOnlineStudio provides 27 free online PDF tools built for speed, privacy, and simplicity. No sign-up, no watermarks, files deleted instantly.',
  alternates: { canonical: 'https://pdfonlinestudio.com/about' },
  openGraph: {
    title: 'About PdfOnlineStudio',
    description: '27 free PDF tools built for speed, privacy, and simplicity.',
    url: 'https://pdfonlinestudio.com/about',
  },
};

const stats = [
  { value: '27',    label: 'Free PDF tools' },
  { value: '100%',  label: 'Free forever' },
  { value: '60 sec',label: 'Max file retention' },
  { value: '100MB', label: 'Max file size' },
];

const values = [
  { icon: '🔒', title: 'Privacy first',        desc: 'Files are never stored beyond the processing window. We never read, share, or analyse your documents.' },
  { icon: '⚡', title: 'Built for speed',       desc: 'Optimised pipelines mean most operations complete in under 3 seconds.' },
  { icon: '💰', title: 'Completely free',       desc: 'No subscriptions, no credits, no paywalls. Every tool, always free.' },
  { icon: '🌍', title: 'Works everywhere',      desc: 'No app download, no browser extension. Works on any device with a web browser.' },
  { icon: '🔐', title: 'AES-256 security',      desc: 'All file transfers are encrypted with TLS. Password protection uses AES-256 encryption.' },
  { icon: '♻️', title: 'Continuously improved', desc: 'We ship updates regularly based on user feedback.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-56 h-56 bg-amber-50 rounded-full opacity-60 blur-2xl" />
        </div>
        <div className="container mx-auto max-w-4xl relative text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-amber-700 tracking-wide">About us</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-display font-semibold text-ink-900 leading-tight mb-6">
            PDF tools that respect<br />
            <span className="relative inline-block">
              <span className="relative z-10">your time & privacy.</span>
              <span className="absolute -bottom-1 left-0 w-full h-3 bg-amber-200 -z-0 skew-x-1" aria-hidden="true" />
            </span>
          </h1>
          <p className="text-lg text-ink-700 max-w-2xl mx-auto leading-relaxed">
            PdfOnlineStudio was built around a simple idea: working with PDFs shouldn't require signing up,
            paying for subscriptions, or wondering where your files end up.
            We built the tools we always wished existed — 27 of them, all free.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-ink-950">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-display font-bold text-amber-400 mb-1">{value}</div>
                <div className="text-sm text-ink-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono tracking-widest text-amber-600 uppercase mb-3">Our mission</p>
              <h2 className="text-3xl font-display font-semibold text-ink-900 mb-5">
                Professional tools, zero friction
              </h2>
              <p className="text-ink-700 leading-relaxed mb-4">
                Too many PDF tools bury simple features behind account walls, upsells, and confusing interfaces.
                PdfOnlineStudio is different — open it, use it, done.
              </p>
              <p className="text-ink-700 leading-relaxed mb-4">
                Every file you upload is processed in an isolated environment and permanently deleted
                the moment your download is ready. We never read, store, or analyse your documents.
              </p>
              <p className="text-ink-700 leading-relaxed">
                All 27 tools are free, work on any device, and require no account or installation.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {values.map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-ink-100 shadow-sm">
                  <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-ink-800 text-sm">{item.title}</p>
                    <p className="text-xs text-ink-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-ink-50/50">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-display font-semibold text-ink-900 mb-4">Ready to get started?</h2>
          <p className="text-ink-600 mb-8">No sign-up. No credit card. Just powerful PDF tools, free forever.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/tools" className="btn-accent">Browse all 27 tools</Link>
            <Link href="/contact" className="btn-outline">Get in touch</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
