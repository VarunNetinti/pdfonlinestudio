import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'How to Convert Word Documents to PDF (5 Methods)',
  description: 'Five ways to turn a .docx or .doc file into a PDF — from Microsoft Word itself to free online converters. No quality loss, fonts preserved.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/how-to-convert-word-to-pdf' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="How to Convert Word Documents to PDF (5 Methods)"
      description="Five ways to turn a .docx or .doc file into a PDF — from Microsoft Word itself to free online converters."
      category="How-to"
      readTime="7 min"
      slug="how-to-convert-word-to-pdf"
      relatedTools={[{ href: '/word-to-pdf', label: 'Word to PDF free' }]}
    >
      <h2>Method 1: Export from Microsoft Word (best quality)</h2>
      <p>
        This is the gold standard — exporting directly from the source application preserves all formatting, fonts, and layout perfectly.
      </p>

      <h3>Word for Windows / Mac (2010 and later)</h3>
      <ol>
        <li>Open your document in Microsoft Word</li>
        <li>Go to <strong>File → Save As</strong> (or <strong>File → Export</strong> in newer versions)</li>
        <li>Select <strong>PDF (*.pdf)</strong> from the format dropdown</li>
        <li>Click <strong>Options</strong> to control image quality, page range, and accessibility settings</li>
        <li>Click <strong>Save</strong></li>
      </ol>
      <p>
        Alternatively: <strong>File → Print → Microsoft Print to PDF</strong> — but this method can reduce image quality slightly compared to Save As PDF.
      </p>

      <h3>Optimise for size vs quality</h3>
      <p>
        In the Save As PDF dialog, you'll see two options:
      </p>
      <ul>
        <li><strong>Standard (publishing online and printing)</strong> — full quality, larger file, embeds all fonts at high resolution</li>
        <li><strong>Minimum size (publishing online)</strong> — smaller file, compresses images more aggressively, better for email</li>
      </ul>

      <h2>Method 2: Google Docs (free, no software)</h2>
      <ol>
        <li>Open Google Docs in your browser</li>
        <li>If your file is a .docx, upload it to Google Drive first (drag and drop), then open it</li>
        <li><strong>File → Download → PDF Document (.pdf)</strong></li>
        <li>The PDF downloads immediately</li>
      </ol>
      <p>
        Google Docs handles most Word formatting well but may have minor differences with complex layouts, custom fonts, or advanced Word features (macros, certain field codes).
      </p>

      <h2>Method 3: PdfOnlineStudio Word to PDF (online, free)</h2>
      <ol>
        <li>Go to <Link href="/word-to-pdf">pdfonlinestudio.com/word-to-pdf</Link></li>
        <li>Upload your .docx, .doc, .odt, or .rtf file</li>
        <li>Click <strong>Convert to PDF</strong></li>
        <li>Download the result</li>
      </ol>
      <p>
        Files are deleted from the server within 60 seconds. No account required, no watermarks.
      </p>

      <h2>Method 4: Using LibreOffice (free desktop app)</h2>
      <p>
        LibreOffice is a free, open-source alternative to Microsoft Office that produces excellent PDF output:
      </p>
      <ol>
        <li>Download and install LibreOffice from libreoffice.org</li>
        <li>Open your Word document in LibreOffice Writer</li>
        <li><strong>File → Export as PDF</strong></li>
        <li>Adjust settings (image resolution, form handling, accessibility) in the export dialog</li>
        <li>Click <strong>Export</strong></li>
      </ol>
      <p>
        LibreOffice also supports batch conversion from the command line, which is useful for converting many documents:
      </p>
      <pre><code>libreoffice --headless --convert-to pdf *.docx</code></pre>

      <h2>Method 5: Print to PDF (any platform)</h2>
      <p>
        Every modern operating system includes a "print to PDF" option that works with any application:
      </p>
      <ul>
        <li><strong>Windows</strong>: File → Print → select "Microsoft Print to PDF" → Print</li>
        <li><strong>Mac</strong>: File → Print → click PDF button (bottom-left) → Save as PDF</li>
        <li><strong>Chrome/Edge</strong>: Ctrl+P → Destination → Save as PDF → Save</li>
      </ul>
      <p>
        Print-to-PDF is convenient but doesn't preserve document metadata, bookmarks, or interactive elements like hyperlinks (links become plain text).
      </p>

      <h2>Preserving hyperlinks in PDF</h2>
      <p>
        If your Word document contains clickable hyperlinks and you need them to work in the PDF:
      </p>
      <ul>
        <li>Use Word's <strong>Save As PDF</strong> (not Print to PDF) — links are preserved</li>
        <li>In Google Docs export, links are preserved automatically</li>
        <li>LibreOffice: links are preserved in the Export as PDF dialog (ensure "Export bookmarks as named destinations" is checked)</li>
        <li>Print to PDF does <em>not</em> preserve links</li>
      </ul>

      <h2>Troubleshooting common issues</h2>

      <h3>Fonts look different in the PDF</h3>
      <p>
        Caused by font embedding issues. Use Word's Save As PDF (not Print to PDF) to ensure fonts are embedded. If using a custom font, ensure it's installed on the computer doing the conversion.
      </p>

      <h3>Images are blurry in the PDF</h3>
      <p>
        Select "Standard" quality (not "Minimum size") in Word's Save As PDF dialog. Or <Link href="/compress">use PdfOnlineStudio compression</Link> after converting to reduce size without degrading the source quality.
      </p>

      <h3>Layout shifted in the output PDF</h3>
      <p>
        Complex Word layouts (text boxes, floating images, custom styles) occasionally shift during conversion. Open the PDF to check, and if needed, adjust the Word document layout before re-converting.
      </p>

      <h2>After converting</h2>
      <p>
        Once you have your PDF, you might want to <Link href="/compress">compress it</Link> for email, <Link href="/merge">merge it</Link> with other PDFs, or <Link href="/protect">add password protection</Link> before sharing. All free at PdfOnlineStudio.
      </p>
    </ArticleLayout>
  );
}
