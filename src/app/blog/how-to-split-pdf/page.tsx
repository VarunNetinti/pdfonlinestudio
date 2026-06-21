import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'How to Split a PDF Into Individual Pages',
  description: 'Learn to extract pages, split by range, or separate every page of a PDF into individual files — free tools and step-by-step instructions.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/how-to-split-pdf' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="How to Split a PDF Into Individual Pages"
      description="Learn to extract pages, split by range, or separate every page of a PDF into individual files."
      category="How-to"
      readTime="5 min"
      slug="how-to-split-pdf"
      relatedTools={[{ href: '/split', label: 'Split PDF free' }]}
    >
      <h2>When do you need to split a PDF?</h2>
      <p>Splitting a PDF is useful when you need to share only part of a document, extract specific pages for a separate project, break a large report into chapters, or separate scanned pages that were incorrectly grouped.</p>

      <h2>How to split a PDF online — free</h2>
      <ol>
        <li>Go to <Link href="/split">PdfOnlineStudio Split PDF</Link></li>
        <li>Upload your PDF (up to 100 MB)</li>
        <li>Choose "Split all pages" to extract every page as a separate PDF, or "Custom range" to specify pages like "1-3, 5, 7-9"</li>
        <li>Click "Split PDF"</li>
        <li>Download the resulting ZIP archive containing all split pages</li>
      </ol>

      <h2>Page range syntax</h2>
      <p>When using custom range mode, use this notation:</p>
      <ul>
        <li><code>1-5</code> — pages 1 through 5</li>
        <li><code>1,3,5</code> — pages 1, 3, and 5 individually</li>
        <li><code>1-3,7,10-12</code> — multiple ranges combined</li>
      </ul>

      <h2>Splitting on Mac (Preview)</h2>
      <ol>
        <li>Open the PDF in Preview</li>
        <li>View → Thumbnails to show the sidebar</li>
        <li>Select the page(s) you want to extract (Cmd+click for multiple)</li>
        <li>Drag selected thumbnails to the Desktop to extract them as new PDF files</li>
      </ol>

      <h2>Splitting on Windows</h2>
      <p>Windows doesn't have built-in split functionality. Use <Link href="/split">PdfOnlineStudio Split PDF</Link> (online, free), PDF24 Creator (free desktop app), or Adobe Acrobat Pro.</p>

      <h2>Splitting via command line (PDFtk)</h2>
      <pre><code># Extract pages 2-5 from a PDF
pdftk input.pdf cat 2-5 output pages-2-to-5.pdf

# Burst into individual pages
pdftk input.pdf burst output page_%02d.pdf</code></pre>

      <h2>Tips</h2>
      <ul>
        <li>After splitting, consider <Link href="/compress">compressing the individual files</Link> — extracted pages are sometimes larger than expected</li>
        <li>If you only need specific content, <Link href="/pdf-to-jpg">convert selected pages to images</Link> instead of splitting</li>
        <li>PDF split/merge tools don't work on password-protected PDFs — <Link href="/unlock">unlock first</Link></li>
      </ul>
    </ArticleLayout>
  );
}
