import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'How to Compress a PDF Without Losing Quality',
  description: 'Step-by-step guide to reducing PDF file size. Learn compression levels, what affects PDF size, and the best free tools to compress PDFs.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/how-to-compress-pdf' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="How to Compress a PDF Without Losing Quality"
      description="Step-by-step guide to reducing PDF file size. Learn when to use different compression levels and what actually affects PDF size."
      category="How-to"
      readTime="6 min"
      slug="how-to-compress-pdf"
      relatedTools={[{ href: '/compress', label: 'Compress PDF free' }]}
    >
      <h2>Why compress a PDF?</h2>
      <p>
        Large PDF files cause real problems: email providers reject attachments over 10–25 MB, cloud storage fills up quickly, and slow uploads frustrate clients. Compressing a PDF reduces its file size — often by 50–70% — while keeping the document readable and professional-looking.
      </p>

      <h2>What makes a PDF large?</h2>
      <p>
        Before compressing, it helps to understand what's actually taking up space in your PDF:
      </p>
      <ul>
        <li><strong>High-resolution images</strong> — the single biggest factor. A PDF with a 10 MB embedded photo is 10 MB (at minimum). Most documents don't need print-quality (300 DPI) images for on-screen reading.</li>
        <li><strong>Embedded fonts</strong> — PDFs embed the fonts used in the document so they display correctly everywhere. Each embedded font adds 100–500 KB.</li>
        <li><strong>Scanned pages</strong> — each scanned page is essentially a photograph. A 300 DPI scan of an A4 page is around 5 MB before compression.</li>
        <li><strong>Metadata and annotations</strong> — revision history, comments, form fields, and bookmarks all add size.</li>
        <li><strong>Dead objects</strong> — deleted content often isn't fully removed from a PDF; the old data is marked as deleted but still occupies space. Re-saving through a tool removes these.</li>
      </ul>

      <h2>Compression levels explained</h2>
      <p>
        Most compression tools offer three levels:
      </p>
      <ul>
        <li>
          <strong>Maximum compression (~70% smaller)</strong> — aggressively downsizes images to screen resolution (72–96 DPI) and applies heavy JPEG compression. Best for documents shared by email or uploaded to web forms. Not suitable for printing.
        </li>
        <li>
          <strong>Balanced compression (~50% smaller)</strong> — reduces images to 150 DPI and applies moderate JPEG compression. Readable quality, good for business documents, presentations, and reports that will be read on screens.
        </li>
        <li>
          <strong>Light compression (~20% smaller)</strong> — minimal image reduction, mainly removes metadata and dead objects. Best when print quality must be preserved.
        </li>
      </ul>

      <h2>How to compress a PDF free — step by step</h2>
      <p>
        Using <Link href="/compress">PdfOnlineStudio Compress PDF</Link>:
      </p>
      <ol>
        <li>Go to <Link href="/compress">pdfonlinestudio.com/compress</Link></li>
        <li>Click "Drop your PDF file here" or drag and drop your file</li>
        <li>Select your compression level (Balanced is a good starting point)</li>
        <li>Click "Compress PDF"</li>
        <li>Download the compressed file — the size reduction is shown on the success screen</li>
      </ol>
      <p>
        The process takes 5–30 seconds depending on file size. Files are automatically deleted after you download.
      </p>

      <h2>Other ways to compress a PDF</h2>

      <h3>In Adobe Acrobat Pro</h3>
      <p>
        File → Save As Other → Optimized PDF → adjust image quality settings → Save. Acrobat's PDF Optimizer gives the most granular control but requires a paid subscription (~$15/month).
      </p>

      <h3>In Preview (Mac)</h3>
      <p>
        Open the PDF in Preview → File → Export as PDF → Quartz Filter → "Reduce File Size". Note: this can degrade image quality significantly. The "Reduce File Size" filter isn't suitable for image-heavy PDFs.
      </p>

      <h3>In Microsoft Word (re-export method)</h3>
      <p>
        If you have the original .docx file, open it in Word → File → Save As → PDF → Options → Picture Quality → set to 96 or 150 PPI. This method only works if you have the source document.
      </p>

      <h3>Using Ghostscript (command line)</h3>
      <p>
        For developers and power users, Ghostscript produces excellent results:
      </p>
      <pre><code>gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf</code></pre>
      <p>
        Replace <code>/ebook</code> with <code>/screen</code> (maximum compression), <code>/printer</code> (high quality), or <code>/prepress</code> (maximum quality).
      </p>

      <h2>When compression isn't enough</h2>
      <p>
        If your PDF is still too large after compression, consider:
      </p>
      <ul>
        <li><strong>Splitting the PDF</strong> — use <Link href="/split">Split PDF</Link> to break a large document into smaller sections</li>
        <li><strong>Removing pages</strong> — extract only the pages you need to share</li>
        <li><strong>Reducing image resolution at source</strong> — if you control the original document, use lower DPI images before creating the PDF</li>
        <li><strong>Using a cloud link</strong> — for very large files (50 MB+), share via Google Drive, Dropbox, or WeTransfer instead of email attachment</li>
      </ul>

      <h2>Will compression reduce image quality visibly?</h2>
      <p>
        At balanced compression, image quality reduction is rarely noticeable on screen. On detailed charts or technical diagrams, some blurring at high zoom levels may appear. For documents that will be printed, always test-print before finalising with compressed images.
      </p>

      <h2>Summary</h2>
      <ul>
        <li>Most PDFs can be reduced by 40–70% without visible quality loss</li>
        <li>Images are the main driver of PDF file size</li>
        <li>Use "Balanced" compression for business documents; "Maximum" for quick shares</li>
        <li>Ghostscript is the best free option for advanced control</li>
        <li>PdfOnlineStudio <Link href="/compress">compresses PDFs free</Link> in under 30 seconds, no account needed</li>
      </ul>
    </ArticleLayout>
  );
}
