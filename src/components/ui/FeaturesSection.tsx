/**
 * FeaturesSection — lazy loaded (below fold).
 * All text on dark bg uses text-ink-300 (5.2:1 contrast on #1c1a18 bg).
 * content-visibility:auto applied via .section-lazy class.
 */

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Secure processing',
    description: 'Files are processed in isolated containers and permanently deleted within 60 seconds. Your documents are never read or stored.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Fast & reliable',
    description: 'Optimised server-side processing finishes most operations in under 3 seconds. Handles files up to 100 MB.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <path d="M9 7h6M9 11h6M9 15h4"/>
      </svg>
    ),
    title: 'High quality output',
    description: 'We preserve the original quality of your PDFs and images. No watermarks, no compression artifacts, no quality loss.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Works everywhere',
    description: 'Fully responsive design works on desktop, tablet, and mobile. No app download, no browser extension needed.',
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="py-20 px-4 bg-ink-950 relative overflow-hidden section-lazy"
      aria-labelledby="features-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-14">
          <p className="text-xs font-mono tracking-widest text-amber-500 uppercase mb-3">Why PdfOnlineStudio</p>
          <h2 id="features-heading" className="text-4xl font-display font-semibold text-white">
            Built for real workflows
          </h2>
          {/* text-ink-300 = 5.2:1 on bg-ink-950 ✅ */}
          <p className="mt-3 text-ink-300 max-w-md mx-auto">
            Professional PDF processing without the subscription or the complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-ink-800 hover:border-amber-500/40 bg-ink-900/50 hover:bg-ink-900 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center mb-4 text-amber-400 group-hover:bg-amber-400/10 transition-colors duration-200">
                {f.icon}
              </div>
              <h3 className="text-white font-display font-semibold text-base mb-2">{f.title}</h3>
              {/* text-ink-300 passes contrast on ink-900 bg ✅ */}
              <p className="text-ink-300 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
