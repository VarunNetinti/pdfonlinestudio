import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'JPG vs PNG in PDFs: Which Image Format Is Better?',
  description: 'When to embed JPG vs PNG images in PDF documents. File size, quality, transparency, and compression trade-offs explained clearly.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/jpg-vs-png-pdf' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="JPG vs PNG in PDFs: Which Image Format Is Better?"
      description="When to embed JPG vs PNG images in your PDF documents — the trade-offs between quality, transparency, and file size."
      category="Guide"
      readTime="6 min"
      slug="jpg-vs-png-pdf"
      relatedTools={[
        { href: '/pdf-to-jpg', label: 'PDF to JPG' },
        { href: '/pdf-to-png', label: 'PDF to PNG' },
        { href: '/jpg-to-pdf', label: 'JPG to PDF' },
        { href: '/png-to-pdf', label: 'PNG to PDF' },
      ]}
    >
      <h2>The core difference</h2>
      <p>
        JPG and PNG use fundamentally different compression approaches:
      </p>
      <ul>
        <li>
          <strong>JPG (JPEG)</strong> uses <em>lossy compression</em> — it discards some visual data to achieve smaller file sizes. The discarded data cannot be recovered. Each time you save a JPG, quality is reduced slightly (though a single save from a high-quality source causes minimal visible loss).
        </li>
        <li>
          <strong>PNG</strong> uses <em>lossless compression</em> — no data is discarded. The output is a perfect representation of the original image, every pixel preserved exactly.
        </li>
      </ul>

      <h2>When to use JPG in PDFs</h2>
      <p>
        JPG is the right choice when:
      </p>
      <ul>
        <li><strong>Images are photographs</strong> — JPG was designed for continuous-tone imagery (photos). The lossy compression is less noticeable in photographs because the eye is less sensitive to small variations in complex, non-uniform colour areas.</li>
        <li><strong>File size is a priority</strong> — JPG files are typically 3–10× smaller than equivalent PNGs for photographic content. For a PDF with 20 photos, this can mean the difference between 5 MB and 50 MB.</li>
        <li><strong>Transparency isn't needed</strong> — JPG doesn't support transparent pixels. All areas of a JPG image have a colour.</li>
        <li><strong>The PDF will be read on screen</strong> — JPG artefacts are less noticeable at normal reading zoom levels.</li>
      </ul>

      <h2>When to use PNG in PDFs</h2>
      <p>
        PNG is the right choice when:
      </p>
      <ul>
        <li><strong>Images contain text, diagrams, or sharp edges</strong> — JPG's compression creates visible artefacts ("ringing" or "blocking") around high-contrast edges like text on a white background. PNG preserves these perfectly.</li>
        <li><strong>Transparency is needed</strong> — logos, icons, and illustrations with transparent backgrounds require PNG (or SVG). JPG replaces transparency with a white background.</li>
        <li><strong>The image will be further edited</strong> — if you need to extract and re-edit the image, PNG preserves quality. Multiple saves of a JPG degrade quality cumulatively.</li>
        <li><strong>Pixel-perfect accuracy matters</strong> — screenshots, UI mockups, technical diagrams, and charts benefit from lossless PNG.</li>
        <li><strong>Print quality</strong> — for professional print work, PNG or TIFF embedded images maintain the quality that printing requires.</li>
      </ul>

      <h2>Visual quality comparison</h2>
      <p>
        The difference between JPG and PNG is most visible in specific scenarios:
      </p>
      <ul>
        <li>
          <strong>Text on white background</strong>: JPG creates fuzzy halos around letters (visible when zooming in). PNG renders text crisp and clean.
        </li>
        <li>
          <strong>Flat colour areas</strong>: JPG creates banding and noise in areas of uniform colour (like a solid blue background). PNG renders them perfectly smooth.
        </li>
        <li>
          <strong>Photographs</strong>: At equivalent file sizes, JPG often looks better than PNG because PNG's lossless compression can't compress photos as efficiently, so you'd need to use lower-quality PNG settings to match JPG file size.
        </li>
      </ul>

      <h2>File size comparison</h2>
      <p>
        For a 2000×1500 pixel image:
      </p>
      <ul>
        <li>
          <strong>Photograph</strong>: JPG at 85% quality ≈ 400 KB; PNG ≈ 2.5 MB (6× larger)
        </li>
        <li>
          <strong>Screenshot with text</strong>: JPG at 85% quality ≈ 200 KB; PNG ≈ 300 KB (1.5× larger, much smaller difference, and PNG looks noticeably better)
        </li>
        <li>
          <strong>Diagram with flat colours</strong>: JPG at 85% quality ≈ 150 KB; PNG ≈ 50 KB (PNG is <em>smaller</em> here because flat colours compress extremely well with lossless compression)
        </li>
      </ul>

      <h2>Converting PDF pages to JPG vs PNG</h2>
      <p>
        When extracting PDF pages as images, the same rules apply:
      </p>
      <ul>
        <li>Use <Link href="/pdf-to-jpg">PDF to JPG</Link> for full-colour document pages that you want to share on the web or embed in presentations. Smaller files, acceptable quality for screen use.</li>
        <li>Use <Link href="/pdf-to-png">PDF to PNG</Link> when you need exact quality — for further editing, when the page contains diagrams or text that will be displayed at large sizes, or when you need a transparent background.</li>
      </ul>

      <h2>Practical recommendations</h2>
      <ul>
        <li>For PDFs containing photographs → embed as JPG at 80–90% quality</li>
        <li>For PDFs containing diagrams, charts, or screenshots → embed as PNG</li>
        <li>For mixed content → use JPG for photo sections, PNG for diagram sections</li>
        <li>For print-ready PDFs → PNG or TIFF at 300 DPI for all images</li>
        <li>For email/web PDFs → JPG is usually the right choice for smaller file sizes</li>
      </ul>

      <h2>What format does a PDF use internally?</h2>
      <p>
        PDFs can store images in multiple formats internally: JPEG, JPEG 2000, JBIG2 (for scans), LZW, Flate (ZIP), and others. When you export from most design tools, the software automatically chooses the appropriate format per image. When you embed images manually, the format you choose is stored as-is inside the PDF container.
      </p>
    </ArticleLayout>
  );
}
