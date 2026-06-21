import type { Metadata } from 'next';
import Link from 'next/link';

interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  category: string;
  readTime: string;
  slug: string;
  relatedTools?: { href: string; label: string }[];
}

export default function ArticleLayout({
  children,
  title,
  description,
  category,
  readTime,
  slug,
  relatedTools = [],
}: ArticleLayoutProps) {
  const publishDate = new Date('2025-01-15').toISOString();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `https://pdfonlinestudio.com/blog/${slug}`,
    datePublished: publishDate,
    dateModified: new Date().toISOString(),
    author: { '@type': 'Organization', name: 'PdfOnlineStudio', url: 'https://pdfonlinestudio.com' },
    publisher: {
      '@type': 'Organization',
      name: 'PdfOnlineStudio',
      url: 'https://pdfonlinestudio.com',
      logo: { '@type': 'ImageObject', url: 'https://pdfonlinestudio.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://pdfonlinestudio.com/blog/${slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="bg-ink-50 border-b border-ink-100 py-3 px-4" aria-label="Breadcrumb">
        <div className="container mx-auto max-w-3xl">
          <ol className="flex items-center gap-2 text-xs text-ink-600">
            <li><Link href="/" className="hover:text-ink-800">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-ink-800">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-ink-700 truncate max-w-[200px]">{title}</li>
          </ol>
        </div>
      </nav>

      <main className="min-h-screen bg-white">
        {/* Article header */}
        <header className="bg-ink-50 border-b border-ink-100 py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                {category}
              </span>
              <span className="text-xs text-ink-600 font-mono">{readTime} read</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink-900 leading-tight mb-4">
              {title}
            </h1>
            <p className="text-ink-600 text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </header>

        {/* Article body */}
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <article className="seo-prose prose-article">
            {children}
          </article>

          {/* Related tools CTA */}
          {relatedTools.length > 0 && (
            <aside className="mt-16 pt-8 border-t border-ink-100">
              <p className="text-xs font-mono tracking-widest text-amber-700 uppercase mb-4">Try it yourself</p>
              <div className="flex flex-wrap gap-3">
                {relatedTools.map(tool => (
                  <Link key={tool.href} href={tool.href}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 transition-colors">
                    {tool.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </aside>
          )}

          {/* Back to blog */}
          <div className="mt-12 pt-8 border-t border-ink-100">
            <Link href="/blog" className="flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              All PDF guides
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
