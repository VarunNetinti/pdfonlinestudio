import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'How to Rotate PDF Pages Online (Free)',
  description: 'Fix incorrectly oriented PDF pages. Rotate individual pages, page ranges, or the entire document by 90°, 180°, or 270°. Free, no software needed.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/how-to-rotate-pdf' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="How to Rotate PDF Pages Online (Free)"
      description="Fix incorrectly oriented PDF pages. Rotate individual pages, page ranges, or the entire document."
      category="How-to"
      readTime="4 min"
      slug="how-to-rotate-pdf"
      relatedTools={[{ href: '/rotate', label: 'Rotate PDF free' }]}
    >
      <h2>Why do PDFs come out the wrong orientation?</h2>
      <p>
        Orientation problems are common when scanning documents. Scanners default to detecting orientation automatically, but they often get it wrong — especially for landscape documents or pages placed sideways in the feeder. The result is a PDF where some or all pages appear rotated 90° or upside-down.
      </p>
      <p>
        Other common causes: exporting from software with incorrect page setup, combining PDFs where source documents had different orientations, or converting from other file formats that used different coordinate systems.
      </p>

      <h2>How to rotate a PDF online — free</h2>
      <ol>
        <li>Go to <Link href="/rotate">PdfOnlineStudio Rotate PDF</Link></li>
        <li>Upload your PDF (up to 100 MB)</li>
        <li>Choose your rotation angle: <strong>90° clockwise</strong>, <strong>180°</strong> (flip upside-down), or <strong>270° clockwise</strong> (= 90° counter-clockwise)</li>
        <li>Choose <strong>All pages</strong> or <strong>Custom range</strong> (e.g. "1-3, 5")</li>
        <li>Click <strong>Rotate PDF</strong></li>
        <li>Download the corrected PDF</li>
      </ol>

      <h2>Rotate PDF on Mac (Preview)</h2>
      <ol>
        <li>Open the PDF in Preview</li>
        <li>In the thumbnail sidebar (View → Thumbnails), select the pages to rotate</li>
        <li>Tools → Rotate Left or Tools → Rotate Right (or use the keyboard shortcut ⌘L / ⌘R)</li>
        <li>File → Save (⌘S) to save the changes</li>
      </ol>
      <p>
        Note: Preview rotates in 90° steps. For 180°, rotate twice. For 270°, rotate left once.
      </p>

      <h2>Rotate PDF on Windows</h2>
      <p>
        Windows doesn't include a native PDF rotation tool. Options:
      </p>
      <ul>
        <li><strong>Online</strong>: <Link href="/rotate">PdfOnlineStudio Rotate PDF</Link> — no software needed, works in any browser</li>
        <li><strong>Adobe Acrobat Reader</strong> (free): View → Rotate View — but this is temporary (display only, not saved). To save permanently: Tools → Organize Pages → right-click → rotate</li>
        <li><strong>PDF24 Creator</strong> (free desktop app): Open PDF → page view → right-click page → rotate</li>
      </ul>

      <h2>Rotate PDF via command line (PDFtk)</h2>
      <pre><code># Rotate all pages 90° clockwise
pdftk input.pdf rotate 1-endE output rotated.pdf

# Rotate specific pages (page 2 east = 90° clockwise)
pdftk input.pdf rotate 2E output rotated.pdf

# Rotation codes: N=0°, E=90°CW, S=180°, W=270°CW</code></pre>

      <h2>Permanent vs temporary rotation</h2>
      <p>
        Some tools (like Adobe Acrobat Reader's View → Rotate View) only rotate the <em>display</em> — the PDF file itself is unchanged. When someone else opens the PDF or you reopen it, it returns to the original orientation.
      </p>
      <p>
        To <strong>permanently fix</strong> the rotation (so it stays rotated for everyone, on every device), you need to save the rotation into the file. PdfOnlineStudio, Preview (Mac), PDFtk, and Acrobat Pro all permanently save the rotation.
      </p>

      <h2>Rotating mixed-orientation documents</h2>
      <p>
        Some PDFs legitimately contain a mix of portrait and landscape pages (a report that includes wide tables, for example). In this case, you want to rotate only the incorrectly oriented pages, not all of them. Use the custom range option:
      </p>
      <ul>
        <li>Identify which pages need rotation by scrolling through the document</li>
        <li>Enter those page numbers in the custom range field (e.g. "3, 7, 11-14")</li>
        <li>Rotate only those pages</li>
      </ul>

      <h2>After rotating</h2>
      <p>
        Once your pages are correctly oriented, consider <Link href="/merge">merging the corrected PDF</Link> back with other documents, or <Link href="/compress">compressing it</Link> to reduce file size before sharing.
      </p>
    </ArticleLayout>
  );
}
