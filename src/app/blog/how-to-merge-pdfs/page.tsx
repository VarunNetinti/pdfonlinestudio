import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'How to Merge PDFs: The Complete Guide',
  description: 'Everything you need to know about combining PDF files — online tools, desktop apps, command-line methods, and tips for best results.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/how-to-merge-pdfs' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="How to Merge PDFs: The Complete Guide"
      description="Everything you need to know about combining PDF files — online tools, desktop apps, and command-line methods."
      category="How-to"
      readTime="7 min"
      slug="how-to-merge-pdfs"
      relatedTools={[{ href: '/merge', label: 'Merge PDFs free' }]}
    >
      <h2>Why merge PDF files?</h2>
      <p>
        Sending multiple separate files creates friction — recipients have to download, track, and manage several attachments instead of one. Merging PDFs into a single document makes sharing simpler, keeps related content together, and creates a more professional result. Common use cases include:
      </p>
      <ul>
        <li>Combining contract pages that were signed separately</li>
        <li>Assembling a multi-chapter report from separate section PDFs</li>
        <li>Collecting scanned receipts or invoices into one file</li>
        <li>Packaging a portfolio of work samples</li>
        <li>Combining a cover letter, CV, and supporting documents for a job application</li>
      </ul>

      <h2>How to merge PDFs online — free</h2>
      <p>
        The fastest way, with no software to install:
      </p>
      <ol>
        <li>Go to <Link href="/merge">PdfOnlineStudio Merge PDF</Link></li>
        <li>Click the upload area or drag and drop your PDF files (up to 20 files, 100 MB each)</li>
        <li>Files are listed in upload order — drag to reorder them if needed</li>
        <li>Click "Merge PDFs"</li>
        <li>Download the merged file</li>
      </ol>
      <p>
        The process takes 5–15 seconds. No account required, no watermarks, and your files are deleted from the server within 60 seconds of download.
      </p>

      <h2>How to merge PDFs on Windows</h2>

      <h3>Using Microsoft Edge (built-in, free)</h3>
      <p>
        Windows 11 and 10 include a basic PDF editor in Edge. However, Edge doesn't support merging multiple PDFs natively. Use an online tool or the free PDF24 Creator app instead.
      </p>

      <h3>Using PDF24 Creator (free desktop app)</h3>
      <ol>
        <li>Download PDF24 Creator from pdf24.org (free, no watermarks)</li>
        <li>Open the app and select "PDF Merge" from the tools</li>
        <li>Drag your PDFs into the window in the order you want</li>
        <li>Click "Merge" and choose a save location</li>
      </ol>

      <h3>Using Adobe Acrobat Pro</h3>
      <ol>
        <li>Open Acrobat → Tools → Combine Files</li>
        <li>Click "Add Files" and select your PDFs</li>
        <li>Reorder files using drag-and-drop</li>
        <li>Click "Combine" to merge and save</li>
      </ol>
      <p>
        Acrobat Pro costs around $15/month. The free Acrobat Reader does not support merging.
      </p>

      <h2>How to merge PDFs on Mac</h2>

      <h3>Using Preview (built-in, free)</h3>
      <p>
        Mac's built-in Preview app can merge PDFs without any extra software:
      </p>
      <ol>
        <li>Open the first PDF in Preview</li>
        <li>Show the sidebar (View → Thumbnails)</li>
        <li>Drag additional PDF files from Finder into the thumbnail sidebar at the position where you want them inserted</li>
        <li>File → Export as PDF to save the merged document</li>
      </ol>
      <p>
        Note: Preview's merge is basic — it works well for standard PDFs but may lose certain interactive elements (forms, bookmarks) from the source files.
      </p>

      <h2>How to merge PDFs using the command line</h2>

      <h3>Using PDFtk (Windows, Mac, Linux)</h3>
      <pre><code>pdftk file1.pdf file2.pdf file3.pdf cat output merged.pdf</code></pre>

      <h3>Using Ghostscript</h3>
      <pre><code>gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=merged.pdf file1.pdf file2.pdf file3.pdf</code></pre>

      <h3>Using pdf-lib (Node.js)</h3>
      <pre><code>{`const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function mergePDFs(paths, outputPath) {
  const merged = await PDFDocument.create();
  for (const path of paths) {
    const doc = await PDFDocument.load(fs.readFileSync(path));
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  fs.writeFileSync(outputPath, await merged.save());
}

mergePDFs(['a.pdf', 'b.pdf', 'c.pdf'], 'merged.pdf');`}</code></pre>

      <h2>Tips for better merged PDFs</h2>
      <ul>
        <li><strong>Check page orientation</strong> — if source files have mixed portrait/landscape pages, use <Link href="/rotate">rotate</Link> to standardise before merging</li>
        <li><strong>Consistent page size</strong> — mixing A4 and Letter pages works fine technically but looks unpolished. Convert to one size first if it matters</li>
        <li><strong>File order matters</strong> — double-check the order before merging; re-merging is easy but adds a step</li>
        <li><strong>Compress the result</strong> — merging multiple PDFs can produce a large file; <Link href="/compress">compress it afterwards</Link> if size is a concern</li>
        <li><strong>Bookmarks</strong> — advanced tools like Acrobat Pro can add a table of contents with bookmarks to the merged PDF, making large merged documents easier to navigate</li>
      </ul>

      <h2>What's preserved when merging?</h2>
      <p>
        When merging with pdf-lib (what PdfOnlineStudio uses):
      </p>
      <ul>
        <li>✅ All page content, images, text, fonts</li>
        <li>✅ Page sizes and orientations</li>
        <li>✅ Embedded images and graphics</li>
        <li>⚠️ Bookmarks and table of contents (merged but may not be nested)</li>
        <li>⚠️ Interactive form fields (preserved but may not be fillable across merged docs)</li>
        <li>❌ Digital signatures (signatures are invalidated when PDFs are merged)</li>
      </ul>

      <h2>Summary</h2>
      <p>
        For quick, free merging without software, <Link href="/merge">PdfOnlineStudio Merge PDF</Link> handles up to 20 files at once. For offline use, Preview on Mac and PDF24 on Windows are the best free desktop options. For developers, PDFtk and pdf-lib offer the most control.
      </p>
    </ArticleLayout>
  );
}
