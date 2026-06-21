import Link from 'next/link';

/**
 * HeroSection — above-fold, server-renderable, zero client JS needed.
 * LCP element is the H1 text — no images = no LCP image to preload.
 * Animations use CSS only (no JS runtime cost).
 * All text colors pass WCAG AA contrast (4.5:1+).
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4" aria-labelledby="hero-heading">
      {/* ── Background decorations — CSS only, no img requests ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-amber-50 rounded-full opacity-60 blur-2xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1c1a18" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-5xl relative">
        <div className="text-center max-w-3xl mx-auto">

          {/* ── Trust badge ── */}
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse-slow" aria-hidden="true" />
            <span className="text-xs font-mono text-amber-800 tracking-wide">Free · No sign-up · Secure</span>
          </div>

          {/* ── H1 — LCP element. NO animation-delay so it renders immediately ── */}
          <h1
            id="hero-heading"
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold text-ink-900 leading-[1.05] mb-5"
          >
            Free PDF tools that
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">just work.</span>
              <span className="absolute -bottom-1 left-0 w-full h-3 bg-amber-200 -z-0 skew-x-1" aria-hidden="true" />
            </span>
          </h1>

          {/* ── Subheading — uses text-ink-700 for contrast ── */}
          <p className="text-lg text-ink-700 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up delay-100">
            Merge, split, compress, and convert PDFs in seconds.
            No account required. Files are permanently deleted after processing.
          </p>

          {/* ── CTA Buttons ── */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-up delay-200">
            <Link href="/merge" className="btn-accent text-base py-3.5 px-7">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
                <rect x="8" y="8" width="12" height="12" rx="2"/>
              </svg>
              Merge PDFs — Free
            </Link>
            <Link href="/tools" className="btn-outline text-base py-3.5 px-7">
              Browse all tools
            </Link>
          </div>
        </div>

        {/* ── Social proof stats ── */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto animate-fade-up delay-300">
          {[
            { value: '100%', label: 'Free forever', srLabel: 'Always free to use' },
            { value: '27+',  label: 'PDF tools',  srLabel: '27 powerful PDF tools available' },
            { value: '0s',   label: 'Files stored', srLabel: 'Files stored for zero seconds' },
          ].map(({ value, label, srLabel }) => (
            <div
              key={label}
              className="text-center py-4 px-3 bg-white/80 rounded-2xl border border-ink-100 shadow-sm"
              aria-label={srLabel}
            >
              <div className="text-2xl font-display font-bold text-ink-900" aria-hidden="true">{value}</div>
              <div className="text-xs text-ink-700 mt-0.5 font-medium" aria-hidden="true">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
