'use client';
import Link from 'next/link';
import { useState } from 'react';

const navToolGroups = [
  {
    group: 'Organise',
    tools: [
      { label: 'Merge PDF',       href: '/merge' },
      { label: 'Split PDF',       href: '/split' },
      { label: 'Rotate PDF',      href: '/rotate' },
      { label: 'Delete Pages',    href: '/delete-pages' },
      { label: 'Extract Pages',   href: '/extract-pages' },
      { label: 'Page Numbers',    href: '/page-numbers' },
    ],
  },
  {
    group: 'Edit & Secure',
    tools: [
      { label: 'Compress PDF',    href: '/compress' },
      { label: 'Watermark PDF',   href: '/watermark' },
      { label: 'Crop PDF',        href: '/crop-pdf' },
      { label: 'Redact PDF',      href: '/redact-pdf' },
      { label: 'Sign PDF',        href: '/sign-pdf' },
      { label: 'Protect PDF',     href: '/protect' },
      { label: 'Unlock PDF',      href: '/unlock' },
      { label: 'Flatten PDF',     href: '/flatten-pdf' },
    ],
  },
  {
    group: 'Convert',
    tools: [
      { label: 'PDF to Word',     href: '/pdf-to-word' },
      { label: 'PDF to Excel',    href: '/pdf-to-excel' },
      { label: 'PDF to PPT',      href: '/pdf-to-ppt' },
      { label: 'PDF to JPG',      href: '/pdf-to-jpg' },
      { label: 'Word to PDF',     href: '/word-to-pdf' },
      { label: 'Excel to PDF',    href: '/excel-to-pdf' },
      { label: 'PPT to PDF',      href: '/ppt-to-pdf' },
      { label: 'JPG to PDF',      href: '/jpg-to-pdf' },
      { label: 'HTML to PDF',     href: '/html-to-pdf' },
      { label: 'TXT to PDF',      href: '/txt-to-pdf' },
    ],
  },
];

const navPages = [
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f7f5f0]/90 backdrop-blur-md border-b border-ink-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors duration-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="1" width="9" height="12" rx="1" fill="white" opacity="0.9"/>
                <rect x="5" y="4" width="8" height="10" rx="1" fill="white" opacity="0.5"/>
                <path d="M4 6h5M4 8h5M4 10h3" stroke="#1c1a18" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-ink-900 text-lg tracking-tight">PdfOnlineStudio</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Tools dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-ink-600 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-all duration-150 font-medium">
                Tools
                <svg
                  width="12" height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="bg-white border border-ink-100 rounded-2xl shadow-xl p-3 w-[520px] grid grid-cols-3 gap-3">
                    {navToolGroups.map(group => (
                      <div key={group.group}>
                        <p className="text-[10px] font-mono text-ink-600 uppercase tracking-widest px-2 mb-1">{group.group}</p>
                        {group.tools.map(tool => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-ink-600 hover:text-ink-900 hover:bg-amber-50 rounded-xl transition-all"
                            onClick={() => setToolsOpen(false)}
                          >
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                            {tool.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                    <div className="col-span-3 border-t border-ink-100 pt-2 mt-1">
                      <Link
                        href="/tools"
                        className="flex items-center gap-2 px-2 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-xl transition-all font-medium"
                        onClick={() => setToolsOpen(false)}
                      >
                        View all {navToolGroups.reduce((a, g) => a + g.tools.length, 0)} tools →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navPages.map(page => (
              <Link
                key={page.href}
                href={page.href}
                className="px-3 py-2 text-sm text-ink-600 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-all duration-150 font-medium"
              >
                {page.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/tools" className="btn-accent text-sm py-2 px-4">
              All Tools
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-ink-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span className={`block h-0.5 bg-ink-800 rounded transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-ink-800 rounded transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-ink-800 rounded transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden py-3 pb-4 border-t border-ink-100 animate-fade-in max-h-[80vh] overflow-y-auto">
            {navToolGroups.map(group => (
              <div key={group.group}>
                <p className="px-4 pt-3 pb-1 text-[10px] font-mono text-ink-600 uppercase tracking-widest">{group.group}</p>
                {group.tools.map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    {tool.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href="/tools"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 font-medium hover:bg-amber-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              All Tools →
            </Link>
            <div className="border-t border-ink-100 my-2" />
            <p className="px-4 pt-1 pb-1 text-[10px] font-mono text-ink-600 uppercase tracking-widest">Learn</p>
            <Link
              href="/blog"
              className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              PDF Guides & Blog
            </Link>
            <div className="border-t border-ink-100 my-2" />
            <p className="px-4 pt-1 pb-1 text-[10px] font-mono text-ink-600 uppercase tracking-widest">Company</p>
            {[
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms' },
            ].map(page => (
              <Link
                key={page.href}
                href={page.href}
                className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {page.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
