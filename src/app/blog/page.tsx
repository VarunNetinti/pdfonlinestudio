import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PDF Guides & Tutorials — PdfOnlineStudio Blog',
  description: 'Free guides on working with PDFs: how to compress, merge, split, convert, and protect PDF files. Practical tutorials for beginners and professionals.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog' },
};

const articles = [
  {
    slug: 'pdf-for-beginners',
    title: 'PDF for Beginners: Everything You Need to Know',
    description: 'A complete introduction to PDF files — what they are, why they exist, and how to work with them on any device.',
    category: 'Basics',
    readTime: '8 min',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    slug: 'how-to-compress-pdf',
    title: 'How to Compress a PDF Without Losing Quality',
    description: 'Step-by-step guide to reducing PDF file size. Learn when to use different compression levels and what affects PDF size.',
    category: 'How-to',
    readTime: '6 min',
    color: 'bg-green-50 text-green-700',
  },
  {
    slug: 'how-to-merge-pdfs',
    title: 'How to Merge PDFs: The Complete Guide',
    description: 'Everything you need to know about combining PDF files — online tools, desktop apps, and command-line methods.',
    category: 'How-to',
    readTime: '7 min',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    slug: 'how-to-split-pdf',
    title: 'How to Split a PDF Into Individual Pages',
    description: 'Learn to extract pages, split by range, or separate every page of a PDF into individual files.',
    category: 'How-to',
    readTime: '5 min',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    slug: 'how-to-convert-pdf-to-jpg',
    title: 'How to Convert PDF Pages to JPG Images',
    description: 'Convert PDF pages to high-resolution JPG or PNG images. Understand DPI settings and when to use each format.',
    category: 'How-to',
    readTime: '6 min',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    slug: 'how-to-convert-word-to-pdf',
    title: 'How to Convert Word Documents to PDF (5 Methods)',
    description: 'Five ways to turn a .docx or .doc file into a PDF — from Microsoft Word itself to free online converters.',
    category: 'How-to',
    readTime: '7 min',
    color: 'bg-sky-50 text-sky-700',
  },
  {
    slug: 'how-to-rotate-pdf',
    title: 'How to Rotate PDF Pages Online (Free)',
    description: 'Fix incorrectly oriented PDF pages. Rotate individual pages, page ranges, or the entire document.',
    category: 'How-to',
    readTime: '4 min',
    color: 'bg-orange-50 text-orange-700',
  },
  {
    slug: 'how-to-add-watermark-pdf',
    title: 'How to Add a Watermark to a PDF',
    description: 'Add "CONFIDENTIAL", "DRAFT", copyright notices, or custom text watermarks to PDF documents.',
    category: 'How-to',
    readTime: '5 min',
    color: 'bg-cyan-50 text-cyan-700',
  },
  {
    slug: 'how-to-edit-pdf-free',
    title: 'How to Edit a PDF for Free (Without Adobe)',
    description: 'The best free ways to edit PDF text, add annotations, fill forms, and modify content without paying for Acrobat.',
    category: 'How-to',
    readTime: '9 min',
    color: 'bg-rose-50 text-rose-700',
  },
  {
    slug: 'pdf-vs-word',
    title: 'PDF vs Word: Which Format Should You Use?',
    description: 'When to use PDF and when to stick with .docx. A practical guide to choosing the right format for every situation.',
    category: 'Guide',
    readTime: '8 min',
    color: 'bg-violet-50 text-violet-700',
  },
  {
    slug: 'pdf-file-size-guide',
    title: 'Why Are PDF Files So Large? (And How to Fix It)',
    description: 'The real reasons PDFs get large — embedded fonts, high-res images, metadata — and how to shrink them effectively.',
    category: 'Guide',
    readTime: '7 min',
    color: 'bg-green-50 text-green-700',
  },
  {
    slug: 'jpg-vs-png-pdf',
    title: 'JPG vs PNG in PDFs: Which Image Format Is Better?',
    description: 'When to embed JPG vs PNG images in your PDF documents. The trade-offs between quality, transparency, and file size.',
    category: 'Guide',
    readTime: '6 min',
    color: 'bg-teal-50 text-teal-700',
  },
  {
    slug: 'pdf-security-guide',
    title: 'PDF Security Guide: Passwords, Encryption & Permissions',
    description: 'How PDF encryption works, the difference between user and owner passwords, and when to use different security levels.',
    category: 'Guide',
    readTime: '9 min',
    color: 'bg-red-50 text-red-700',
  },
  {
    slug: 'best-pdf-tools-2025',
    title: 'Best Free PDF Tools in 2025 (Compared)',
    description: 'An honest comparison of the best free online PDF tools available today — features, limits, privacy, and performance.',
    category: 'Comparison',
    readTime: '10 min',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    slug: 'pdf-accessibility-guide',
    title: 'PDF Accessibility: How to Make PDFs Readable for Everyone',
    description: 'How to create accessible PDFs with proper tags, alt text, reading order, and contrast — for screen readers and compliance.',
    category: 'Guide',
    readTime: '8 min',
    color: 'bg-indigo-50 text-indigo-700',
  },
];

const categories = ['All', 'Basics', 'How-to', 'Guide', 'Comparison'];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-ink-50 border-b border-ink-100 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-xs font-mono tracking-widest text-amber-700 uppercase mb-3">Learning centre</p>
          <h1 className="text-4xl sm:text-5xl font-display font-semibold text-ink-900 mb-4">
            PDF Guides & Tutorials
          </h1>
          <p className="text-ink-600 max-w-xl mx-auto text-lg">
            Practical guides on compressing, converting, editing, and securing PDF files. No fluff, just actionable instructions.
          </p>
        </div>
      </section>

      {/* JSON-LD for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': 'https://pdfonlinestudio.com/blog',
            name: 'PdfOnlineStudio PDF Guides',
            description: 'Practical PDF tutorials and guides',
            url: 'https://pdfonlinestudio.com/blog',
            publisher: { '@type': 'Organization', name: 'PdfOnlineStudio', url: 'https://pdfonlinestudio.com' },
            blogPost: articles.map(a => ({
              '@type': 'BlogPosting',
              headline: a.title,
              description: a.description,
              url: `https://pdfonlinestudio.com/blog/${a.slug}`,
            })),
          }),
        }}
      />

      {/* Articles grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-ink-100 bg-white hover:shadow-md hover:border-ink-200 transition-all duration-200 overflow-hidden"
              >
                {/* Color bar */}
                <div className={`h-1.5 w-full ${article.color.split(' ')[0]}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Category + read time */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${article.color}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-ink-600 font-mono">{article.readTime} read</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display font-semibold text-ink-900 text-lg leading-snug mb-3 group-hover:text-amber-800 transition-colors">
                    {article.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-ink-600 leading-relaxed flex-1">
                    {article.description}
                  </p>

                  {/* Read more */}
                  <div className="flex items-center gap-1 mt-4 text-sm font-medium text-ink-600 group-hover:text-ink-900 transition-colors">
                    Read article
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-ink-950 py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-display font-semibold text-white mb-4">Ready to work with your PDFs?</h2>
          <p className="text-ink-300 mb-8">All tools are free, instant, and require no account. Files are deleted automatically after processing.</p>
          <Link href="/" className="btn-accent">
            Browse all tools →
          </Link>
        </div>
      </section>
    </main>
  );
}
