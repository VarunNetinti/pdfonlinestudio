import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'How to Add a Watermark to a PDF',
  description: 'Add CONFIDENTIAL, DRAFT, copyright notices, or custom text watermarks to PDF documents. Free online tool plus desktop and command-line methods.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/how-to-add-watermark-pdf' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="How to Add a Watermark to a PDF"
      description="Add custom text watermarks — CONFIDENTIAL, DRAFT, copyright notices — to every page of a PDF. Free tools and step-by-step methods."
      category="How-to"
      readTime="5 min"
      slug="how-to-add-watermark-pdf"
      relatedTools={[{ href: '/watermark', label: 'Watermark PDF free' }]}
    >
      <h2>What is a PDF watermark?</h2>
      <p>
        A watermark is text (or an image) overlaid on a document's pages, usually semi-transparent. Text watermarks like "CONFIDENTIAL", "DRAFT", "SAMPLE", or a company name serve as visual indicators of a document's status or ownership. They don't prevent copying but make the document's purpose immediately clear.
      </p>

      <h2>Common watermark use cases</h2>
      <ul>
        <li><strong>CONFIDENTIAL / RESTRICTED</strong> — internal documents shared outside the organisation</li>
        <li><strong>DRAFT</strong> — documents under review, not yet approved for distribution</li>
        <li><strong>SAMPLE</strong> — proposals, templates, or example documents sent to clients</li>
        <li><strong>DO NOT COPY</strong> — educational materials, exam papers</li>
        <li><strong>© 2025 Company Name</strong> — copyright assertion on distributed materials</li>
        <li><strong>Client name</strong> — personalised copies of proposals or reports (helps identify the source if a document is leaked)</li>
        <li><strong>VOID</strong> — cancelled invoices or superseded document versions</li>
      </ul>

      <h2>How to add a watermark to a PDF — free online</h2>
      <ol>
        <li>Go to <Link href="/watermark">PdfOnlineStudio Watermark PDF</Link></li>
        <li>Upload your PDF</li>
        <li>Type your watermark text (up to 80 characters)</li>
        <li>Set the font size (48pt is a good default for diagonal center watermarks)</li>
        <li>Adjust opacity (20–40% for subtle, 50–70% for prominent)</li>
        <li>Choose position: center (diagonal), or a corner</li>
        <li>Click <strong>Add Watermark</strong></li>
        <li>Download the watermarked PDF</li>
      </ol>

      <h2>Choosing the right opacity</h2>
      <ul>
        <li><strong>10–20%</strong> — very subtle, barely noticeable unless looking for it. Good for branding on distributed copies.</li>
        <li><strong>25–40%</strong> — clearly visible but doesn't obscure content. The standard range for most uses.</li>
        <li><strong>50–70%</strong> — prominent. Use for DRAFT or VOID stamps where you want the watermark to dominate.</li>
        <li><strong>80%+</strong> — very heavy, makes content difficult to read. Avoid unless intentional.</li>
      </ul>

      <h2>Position guide</h2>
      <ul>
        <li><strong>Center (diagonal)</strong> — covers the entire page. Standard for CONFIDENTIAL and DRAFT. Hard to crop out.</li>
        <li><strong>Top/bottom center</strong> — visible but doesn't interfere with main content. Good for copyright notices.</li>
        <li><strong>Bottom right</strong> — subtle corner placement. Common for company name watermarks on proposals.</li>
      </ul>

      <h2>Adding watermarks on Mac (Preview)</h2>
      <p>
        Preview doesn't support text watermarks directly. Workarounds:
      </p>
      <ul>
        <li>Use <Link href="/watermark">PdfOnlineStudio Watermark PDF</Link> online</li>
        <li>Create a watermark in Pages or Word, export as PDF, then use Preview to overlay it onto your document (File → Print → PDF workflow)</li>
      </ul>

      <h2>Adding watermarks in Adobe Acrobat Pro</h2>
      <ol>
        <li>Tools → Edit PDF → Watermark → Add</li>
        <li>Enter your text or choose an image</li>
        <li>Set appearance: font, size, colour, opacity, rotation</li>
        <li>Set position and page range</li>
        <li>Click OK, then save the file</li>
      </ol>
      <p>
        Acrobat Pro also lets you apply watermarks to batches of files — useful if you need to stamp an entire folder of documents.
      </p>

      <h2>Adding watermarks via command line (pdf-lib / Node.js)</h2>
      <pre><code>{`const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const fs = require('fs');

async function addWatermark(inputPath, text, outputPath) {
  const pdfDoc = await PDFDocument.load(fs.readFileSync(inputPath));
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const page of pdfDoc.getPages()) {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 4, y: height / 4,
      size: 60, font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.3,
      rotate: degrees(45),
    });
  }

  fs.writeFileSync(outputPath, await pdfDoc.save());
}

addWatermark('input.pdf', 'CONFIDENTIAL', 'watermarked.pdf');`}</code></pre>

      <h2>Can watermarks be removed?</h2>
      <p>
        Text watermarks added to PDFs can technically be removed by editing the PDF content stream (using tools like Acrobat Pro or code). They are not a security measure — they're a visual deterrent and a clear signal of document status. For actual document security, use <Link href="/protect">password protection</Link> and <Link href="/blog/pdf-security-guide">encryption</Link>.
      </p>

      <h2>Image watermarks vs text watermarks</h2>
      <p>
        Some organisations use logo image watermarks instead of text. These can be more visually appealing but require embedding an image into each page. PdfOnlineStudio currently supports text watermarks. For image watermarks, Adobe Acrobat Pro or Scribus (free, open source) are good options.
      </p>
    </ArticleLayout>
  );
}
