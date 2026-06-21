import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'How to Convert PDF Pages to JPG Images',
  description: 'Convert PDF pages to high-resolution JPG or PNG images. Understand DPI settings, quality trade-offs, and the best free tools for every platform.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/how-to-convert-pdf-to-jpg' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="How to Convert PDF Pages to JPG Images"
      description="Convert PDF pages to high-resolution JPG or PNG images. Understand DPI settings and when to use each format."
      category="How-to"
      readTime="6 min"
      slug="how-to-convert-pdf-to-jpg"
      relatedTools={[
        { href: '/pdf-to-jpg', label: 'PDF to JPG' },
        { href: '/pdf-to-png', label: 'PDF to PNG' },
      ]}
    >
      <h2>Why convert a PDF to images?</h2>
      <p>
        Converting PDF pages to JPG or PNG images is useful in many situations: embedding a document page into a website or presentation, sharing a specific page on social media, using a diagram from a PDF in another document, creating thumbnails for document previews, or working with content in image editors like Photoshop or GIMP.
      </p>

      <h2>JPG vs PNG: which format to choose?</h2>
      <ul>
        <li>
          <strong>JPG</strong> — smaller files, good for photos and colour-heavy pages. Uses lossy compression, which can introduce subtle artefacts around text and sharp edges at low quality settings. Best for: photographs, full-colour pages, web thumbnails.
        </li>
        <li>
          <strong>PNG</strong> — lossless compression, larger files. Every pixel is preserved exactly. Supports transparent backgrounds. Best for: diagrams, charts, text-heavy pages, anything that will be further edited, or when transparency matters.
        </li>
      </ul>
      <p>
        For most casual use, JPG at 150 DPI is ideal. For design work or print output, use PNG at 200–300 DPI.
      </p>

      <h2>Understanding DPI</h2>
      <p>
        DPI (dots per inch) controls the resolution of the output image. Higher DPI = sharper image = larger file:
      </p>
      <ul>
        <li><strong>72 DPI</strong> — screen resolution, smallest files. Fine for web thumbnails where the image will be displayed small.</li>
        <li><strong>150 DPI</strong> — standard quality. Good for screen viewing and presentations at full size. This is the sweet spot for most uses.</li>
        <li><strong>200 DPI</strong> — high quality. Suitable for large on-screen display or moderate print output.</li>
        <li><strong>300 DPI</strong> — print quality. Standard for professional printing. Files are 4× larger than 150 DPI.</li>
      </ul>
      <p>
        A 150 DPI JPG of an A4 page is roughly 1240×1754 pixels and around 200–400 KB. The same page at 300 DPI is 2480×3508 pixels and 1–3 MB.
      </p>

      <h2>How to convert PDF to JPG online — free</h2>
      <ol>
        <li>Go to <Link href="/pdf-to-jpg">PdfOnlineStudio PDF to JPG</Link></li>
        <li>Upload your PDF (up to 100 MB)</li>
        <li>Set your DPI: 72 for web, 150 for standard, 300 for print</li>
        <li>Click "Convert to JPG"</li>
        <li>Download the ZIP archive containing one JPG per page</li>
      </ol>
      <p>
        Processing takes 5–30 seconds depending on page count and DPI. No account required.
      </p>

      <h2>Convert PDF to JPG on Mac (Preview)</h2>
      <ol>
        <li>Open the PDF in Preview</li>
        <li>File → Export</li>
        <li>Change the Format to "JPEG" or "PNG"</li>
        <li>Adjust the Resolution slider for DPI</li>
        <li>Click Save</li>
      </ol>
      <p>
        Preview exports one page at a time. To export all pages, select all thumbnails in the sidebar before exporting — or use Automator to batch-process.
      </p>

      <h2>Convert PDF to JPG on Windows</h2>
      <p>
        Windows doesn't include a native PDF-to-image converter. Options:
      </p>
      <ul>
        <li><strong>Online</strong>: use <Link href="/pdf-to-jpg">PdfOnlineStudio PDF to JPG</Link> — fastest option, no software needed</li>
        <li><strong>IrfanView</strong> (free): open the PDF, File → Save As → JPEG. Requires Ghostscript installed separately</li>
        <li><strong>GIMP</strong> (free): File → Open → select PDF → choose pages → export as JPG</li>
        <li><strong>Adobe Acrobat Pro</strong>: Tools → Export PDF → Image → JPEG</li>
      </ul>

      <h2>Convert PDF to JPG via command line (Ghostscript)</h2>
      <pre><code># Convert all pages to JPG at 150 DPI
gs -dNOPAUSE -sDEVICE=jpeg -r150 -dBATCH -sOutputFile=page-%03d.jpg input.pdf

# Convert to PNG at 300 DPI
gs -dNOPAUSE -sDEVICE=png16m -r300 -dBATCH -sOutputFile=page-%03d.png input.pdf</code></pre>

      <h2>Convert PDF to JPG with Python (pdf2image)</h2>
      <pre><code>{`from pdf2image import convert_from_path

# Convert at 150 DPI
images = convert_from_path('document.pdf', dpi=150)
for i, img in enumerate(images):
    img.save(f'page-{i+1:03d}.jpg', 'JPEG', quality=85)`}</code></pre>
      <p>
        Requires: <code>pip install pdf2image</code> and Poppler installed on the system.
      </p>

      <h2>Getting the best quality output</h2>
      <ul>
        <li>Use PNG for diagrams and text pages — JPG artefacts are visible on high-contrast edges</li>
        <li>150 DPI is enough for most screen use — 300 DPI produces 4× larger files for marginal visible improvement on screens</li>
        <li>If the PDF has embedded vector graphics, they'll render sharply at any DPI</li>
        <li>If converting a scanned PDF, higher DPI captures more of the original scan detail — but there's no benefit going above the scan's original resolution</li>
      </ul>

      <h2>See also</h2>
      <p>
        Going the other direction? Convert images back into a PDF with <Link href="/jpg-to-pdf">JPG to PDF</Link> or <Link href="/png-to-pdf">PNG to PDF</Link>. For a deep dive on format choice, see <Link href="/blog/jpg-vs-png-pdf">JPG vs PNG in PDFs</Link>.
      </p>
    </ArticleLayout>
  );
}
