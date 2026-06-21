/**
 * SeoContent.tsx
 * ──────────────
 * Rich SEO content block placed below the tool grid.
 * - Targets 20+ long-tail keywords naturally
 * - FAQ schema markup (JSON-LD) embedded inline
 * - Internal links to all tool pages
 * - Answers "People Also Ask" questions for featured snippets
 * - Lazy loaded (does not affect LCP/TBT)
 */

import Link from 'next/link';

const faqs = [
  {
    q: 'How do I merge PDF files online for free?',
    a: 'Upload two or more PDF files using the PdfOnlineStudio Merge PDF tool. Drag and drop your files in the desired order, then click "Merge PDFs". Your combined PDF is ready to download in seconds — no account or payment required.',
  },
  {
    q: 'Is it safe to upload PDFs to an online tool?',
    a: 'Yes. PdfOnlineStudio processes all files in isolated server environments. Your files are permanently deleted immediately after your download is ready — typically within 60 seconds. We never read, store, or share your documents.',
  },
  {
    q: 'How do I reduce PDF file size without losing quality?',
    a: 'Use the PdfOnlineStudio Compress PDF tool. Choose the "Balanced" compression level to reduce file size by up to 50% while maintaining readable quality. For the smallest possible file, choose "Maximum compression".',
  },
  {
    q: 'Can I convert a PDF to JPG online?',
    a: 'Yes. Upload your PDF to the PDF to JPG converter. Each page is converted to a high-resolution JPG image. You can set the DPI (72 for web, 150 for standard, 300 for print). All images are delivered as a ZIP archive.',
  },
  {
    q: 'How do I split a PDF into individual pages?',
    a: 'Use the Split PDF tool. Upload your PDF and choose "Split all pages" to extract every page as a separate PDF, or enter a custom page range like "1-3,5,7-9" to extract specific pages. Download all pages in a ZIP file.',
  },
  {
    q: 'How do I convert JPG images to PDF?',
    a: 'Upload one or more JPG, PNG, or WEBP images to the JPG to PDF converter. Select your preferred page size (A4, Letter, or fit-to-image), then click convert. All images are combined into a single, polished PDF document.',
  },
  {
    q: 'What is the maximum file size for PdfOnlineStudio?',
    a: 'PdfOnlineStudio supports files up to 100MB per upload. For the Merge PDF tool, you can combine up to 20 PDF files at once. For JPG to PDF, you can upload up to 30 images in a single batch.',
  },
  {
    q: 'Do I need to create an account to use PdfOnlineStudio?',
    a: 'No. PdfOnlineStudio requires no account, no email address, and no password. All tools are completely free and accessible immediately. Simply visit the tool page, upload your file, and download the result.',
  },
];

const toolLinks = [
  { href: '/merge',      label: 'Merge PDF',      desc: 'Combine multiple PDFs into one file' },
  { href: '/split',      label: 'Split PDF',       desc: 'Extract pages or split into separate files' },
  { href: '/compress',   label: 'Compress PDF',    desc: 'Reduce file size up to 70%' },
  { href: '/pdf-to-jpg', label: 'PDF to JPG',      desc: 'Convert each page to a JPG image' },
  { href: '/jpg-to-pdf', label: 'JPG to PDF',      desc: 'Build a PDF from one or more images' },
];

export default function SeoContent() {
  return (
    <>
      {/* ── FAQ JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white section-lazy" aria-labelledby="how-heading">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest text-amber-700 uppercase mb-3">Simple process</p>
            <h2 id="how-heading" className="text-3xl font-display font-semibold text-ink-900">
              How to use PdfOnlineStudio PDF tools
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Upload your file',
                desc: 'Drag and drop your PDF or image files onto the tool page, or click to browse. Supports files up to 100 MB.',
              },
              {
                step: '02',
                title: 'Choose your settings',
                desc: 'Select options like compression level, page range, image DPI, or output page size — depending on the tool.',
              },
              {
                step: '03',
                title: 'Download instantly',
                desc: 'Processing takes seconds. Click download to save your result. Your file is then permanently deleted from our servers.',
              },
            ].map(item => (
              <div key={item.step} className="relative p-6 rounded-2xl bg-ink-50 border border-ink-100">
                <span className="text-5xl font-display font-bold text-ink-100 absolute top-4 right-5 select-none" aria-hidden="true">
                  {item.step}
                </span>
                <h3 className="text-base font-display font-semibold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-sm text-ink-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main SEO Article ─────────────────────────────────── */}
      <section className="py-16 px-4 section-lazy" aria-labelledby="about-tools-heading">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Article — 2/3 width */}
            <article className="lg:col-span-2 seo-prose">
              <h2 id="about-tools-heading">Free Online PDF Tools — No Sign-Up Required</h2>
              <p>
                <strong>PdfOnlineStudio</strong> is a free suite of online PDF tools designed for individuals, students, and businesses who need to work with PDF files quickly and securely. Unlike many PDF editors that require subscriptions or account creation, PdfOnlineStudio is completely free to use — no email, no credit card, no watermarks.
              </p>

              <h3>Merge PDF Files Online</h3>
              <p>
                The <Link href="/merge" className="text-amber-700 underline underline-offset-2 hover:text-amber-900">Merge PDF</Link> tool lets you combine two or more PDF files into a single document. Upload up to 20 PDF files, arrange them in the correct order, and download your merged PDF within seconds. Ideal for combining contracts, reports, chapters, or scanned documents.
              </p>

              <h3>Split PDF into Separate Pages</h3>
              <p>
                Need to extract just a few pages from a large PDF? The <Link href="/split" className="text-amber-700 underline underline-offset-2 hover:text-amber-900">Split PDF</Link> tool lets you either extract all pages as individual files, or specify a custom page range (e.g. "1-3,5,8-10"). Results are delivered as a ZIP archive for easy download.
              </p>

              <h3>Compress PDF to Reduce File Size</h3>
              <p>
                Large PDF files are hard to share by email and slow to upload. The <Link href="/compress" className="text-amber-700 underline underline-offset-2 hover:text-amber-900">Compress PDF</Link> tool reduces your file size by up to 70% using three quality modes: Maximum compression for the smallest file, Balanced for everyday sharing, and High Quality for archival purposes.
              </p>

              <h3>Convert PDF Pages to JPG Images</h3>
              <p>
                The <Link href="/pdf-to-jpg" className="text-amber-700 underline underline-offset-2 hover:text-amber-900">PDF to JPG</Link> converter turns each page of your PDF into a high-resolution image. Adjust the DPI (resolution) from 72 dpi for web use up to 300 dpi for print-quality output. All converted images are packaged in a single ZIP file.
              </p>

              <h3>Convert JPG Images to PDF</h3>
              <p>
                Turn your photos, scans, or graphics into a professional PDF using the <Link href="/jpg-to-pdf" className="text-amber-700 underline underline-offset-2 hover:text-amber-900">JPG to PDF</Link> tool. Upload multiple images at once — JPG, PNG, and WEBP are all supported. Choose A4, Letter, or fit-to-image page sizing. All images are automatically centred with aspect ratio preserved.
              </p>

              <h3>Your Privacy Is Our Priority</h3>
              <p>
                Every file uploaded to PdfOnlineStudio is processed in an isolated server environment and <strong>permanently deleted within 60 seconds</strong> of your download completing. We never read your file contents, never sell your data, and never retain copies. Your documents belong to you.
              </p>
            </article>

            {/* Sidebar — tool links + trust signals */}
            <aside className="space-y-6">
              <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-ink-800 uppercase tracking-wider font-mono mb-4">All PDF Tools</h3>
                <nav aria-label="PDF tool links">
                  <ul className="space-y-2">
                    {toolLinks.map(tool => (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50 transition-colors group"
                        >
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-ink-800 group-hover:text-amber-700">{tool.label}</p>
                            <p className="text-xs text-ink-600 mt-0.5">{tool.desc}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Trust box */}
              <div className="bg-ink-950 rounded-2xl p-5 text-white">
                <h3 className="text-sm font-mono uppercase tracking-wider text-amber-400 mb-4">Why trust us?</h3>
                <ul className="space-y-3">
                  {[
                    { icon: '🔒', text: 'Files deleted in &lt;60 seconds' },
                    { icon: '🚫', text: 'No account or email needed' },
                    { icon: '💸', text: 'Completely free — no limits' },
                    { icon: '🌍', text: 'Works on any device, anywhere' },
                    { icon: '⚡', text: 'Results in under 3 seconds' },
                    { icon: '📜', text: 'No watermarks on output files' },
                  ].map(item => (
                    <li key={item.text} className="flex items-center gap-2.5 text-sm text-ink-300">
                      <span className="text-base">{item.icon}</span>
                      <span dangerouslySetInnerHTML={{ __html: item.text }} />
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white section-lazy" aria-labelledby="faq-heading">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest text-amber-700 uppercase mb-3">FAQ</p>
            <h2 id="faq-heading" className="text-3xl font-display font-semibold text-ink-900">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-ink-700 max-w-lg mx-auto">
              Everything you need to know about PdfOnlineStudio and our free PDF tools.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group bg-ink-50 border border-ink-100 rounded-2xl p-5 open:bg-white open:shadow-sm transition-all duration-200"
              >
                <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
                  <h3 className="text-sm font-semibold text-ink-900 leading-snug">{q}</h3>
                  <svg
                    width="16" height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0 text-ink-600 mt-0.5 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-ink-700 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
