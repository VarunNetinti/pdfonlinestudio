import Link from 'next/link';
import AdSlot from './AdSlot';

interface ToolPageLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
  toolPath?: string;
}

/**
 * ToolPageLayout — shared wrapper for all tool pages.
 * Includes:
 *   - BreadcrumbList JSON-LD (rich result eligible)
 *   - Ad slots with height reservation (CLS prevention)
 *   - Accessible landmarks (nav, main already in layout)
 *   - Skip link target: #tool-content
 */
export default function ToolPageLayout({
  title,
  description,
  icon,
  iconColor,
  children,
  toolPath,
}: ToolPageLayoutProps) {
  return (
    <div className="min-h-screen py-10 px-4">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pdfonlinestudio.com' },
              { '@type': 'ListItem', position: 2, name: title, item: `https://pdfonlinestudio.com${toolPath || ''}` },
            ],
          }),
        }}
      />

      <div className="container mx-auto max-w-3xl">

        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink-600 mb-8 font-mono">
          <Link href="/" className="hover:text-ink-900 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink-900 font-medium" aria-current="page">{title}</span>
        </nav>

        {/* Top Ad */}
        <AdSlot label="Top Banner — 728×90" height="90px" className="mb-8" />

        {/* Tool header */}
        <header className="flex items-start gap-5 mb-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconColor}`} aria-hidden="true">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink-900">{title}</h1>
            <p className="text-ink-700 mt-1 leading-relaxed">{description}</p>
          </div>
        </header>

        {/* Main tool content */}
        <section
          id="tool-content"
          className="bg-white border border-ink-100 rounded-3xl p-6 sm:p-8 shadow-sm"
          aria-label={`${title} tool`}
        >
          {children}
        </section>

        {/* Bottom Ad */}
        <AdSlot label="Bottom Banner — 728×90" height="90px" className="mt-8" />

        {/* Back link */}
        <div className="text-center mt-8">
          <Link
            href="/tools"
            className="text-sm text-ink-600 hover:text-ink-900 transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Browse all PDF tools
          </Link>
        </div>
      </div>
    </div>
  );
}
