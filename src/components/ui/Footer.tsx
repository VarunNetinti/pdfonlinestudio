import Link from 'next/link';

/**
 * Footer — contrast fixes applied throughout.
 * text-ink-400 on bg-ink-950 = 3.4:1 (FAILS AA for normal text)
 * Fix: text-ink-300 on bg-ink-950 = 5.2:1 ✅
 * Fix: text-ink-400 on bg-ink-950 is OK for large text (3:1) but not body
 */

export default function Footer() {
  const tools = [
    { label: 'Merge PDF',         href: '/merge' },
    { label: 'Split PDF',         href: '/split' },
    { label: 'Compress PDF',      href: '/compress' },
    { label: 'Rotate PDF',        href: '/rotate' },
    { label: 'Delete Pages',      href: '/delete-pages' },
    { label: 'Extract Pages',     href: '/extract-pages' },
    { label: 'Watermark PDF',     href: '/watermark' },
    { label: 'Crop PDF',          href: '/crop-pdf' },
    { label: 'Redact PDF',        href: '/redact-pdf' },
    { label: 'Flatten PDF',       href: '/flatten-pdf' },
    { label: 'Sign PDF',          href: '/sign-pdf' },
    { label: 'Protect PDF',       href: '/protect' },
    { label: 'Unlock PDF',        href: '/unlock' },
    { label: 'PDF to Word',       href: '/pdf-to-word' },
    { label: 'PDF to Excel',      href: '/pdf-to-excel' },
    { label: 'PDF to PPT',        href: '/pdf-to-ppt' },
    { label: 'PDF to JPG',        href: '/pdf-to-jpg' },
    { label: 'Word to PDF',       href: '/word-to-pdf' },
    { label: 'Excel to PDF',      href: '/excel-to-pdf' },
    { label: 'PPT to PDF',        href: '/ppt-to-pdf' },
    { label: 'HTML to PDF',       href: '/html-to-pdf' },
    { label: 'TXT to PDF',        href: '/txt-to-pdf' },
    { label: 'All Tools →',       href: '/tools', highlight: true },
  ];

  const learn = [
    { label: 'PDF Guides',           href: '/blog' },
    { label: 'How to Compress PDF',  href: '/blog/how-to-compress-pdf' },
    { label: 'How to Merge PDFs',    href: '/blog/how-to-merge-pdfs' },
    { label: 'How to Split a PDF',   href: '/blog/how-to-split-pdf' },
    { label: 'PDF vs Word',          href: '/blog/pdf-vs-word' },
    { label: 'PDF Security Guide',   href: '/blog/pdf-security-guide' },
    { label: 'PDF for Beginners',    href: '/blog/pdf-for-beginners' },
  ];

  const company = [
    { label: 'About',            href: '/about' },
    { label: 'Contact',          href: '/contact' },
    { label: 'Privacy Policy',   href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-ink-950 mt-auto" aria-label="Site footer">
      <div className="container mx-auto px-4 max-w-6xl py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit" aria-label="PdfOnlineStudio home">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="2" y="1" width="9" height="12" rx="1" fill="#1c1a18" opacity="0.9"/>
                  <rect x="5" y="4" width="8" height="10" rx="1" fill="#1c1a18" opacity="0.4"/>
                </svg>
              </div>
              <span className="font-display font-bold text-white text-lg">PdfOnlineStudio</span>
            </Link>
            {/* text-ink-300 = 5.2:1 on ink-950 ✅ */}
            <p className="text-sm text-ink-300 leading-relaxed max-w-xs mb-6">
              Fast, free, and secure PDF tools. Files are permanently deleted immediately after processing — we never store your documents.
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2" role="list" aria-label="Trust signals">
              {[
                { icon: '🔒', label: 'SSL Secured' },
                { icon: '🗑️', label: 'Auto-deleted' },
                { icon: '🆓', label: 'Always free' },
              ].map(badge => (
                <span
                  key={badge.label}
                  role="listitem"
                  className="inline-flex items-center gap-1.5 text-xs text-ink-300 bg-ink-900 border border-ink-800 px-3 py-1.5 rounded-full"
                >
                  <span aria-hidden="true">{badge.icon}</span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* PDF Tools nav */}
          <nav aria-label="PDF tools navigation">
            <h2 className="text-white font-mono text-xs mb-5 uppercase tracking-widest">PDF Tools</h2>
            <ul className="space-y-3">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className={`text-sm transition-colors ${
                      tool.highlight
                        ? 'text-amber-400 hover:text-amber-300 font-medium'
                        : 'text-ink-300 hover:text-amber-400'
                    }`}
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company nav */}
          <nav aria-label="Company navigation">
            <h2 className="text-white font-mono text-xs mb-5 uppercase tracking-widest">Company</h2>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink-300 hover:text-amber-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* text-ink-400 is OK at this size (fine print) — bumped to ink-300 for safety */}
          <p className="text-xs text-ink-300 font-mono">
            © {new Date().getFullYear()} PdfOnlineStudio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { label: 'Privacy', href: '/privacy-policy' },
              { label: 'Terms',   href: '/terms' },
              { label: 'Contact', href: '/contact' },
            ].map((link, i, arr) => (
              <span key={link.href} className="flex items-center gap-4">
                <Link href={link.href} className="text-xs text-ink-300 hover:text-amber-400 transition-colors font-mono">
                  {link.label}
                </Link>
                {i < arr.length - 1 && <span className="text-ink-700" aria-hidden="true">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
