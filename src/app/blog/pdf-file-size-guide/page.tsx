import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'Why Are PDF Files So Large? (And How to Fix It)',
  description: 'The real reasons PDFs get large — embedded fonts, high-res images, scanned pages, metadata — and practical ways to shrink them without losing quality.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/pdf-file-size-guide' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="Why Are PDF Files So Large? (And How to Fix It)"
      description="The real reasons PDFs get large — embedded fonts, high-res images, metadata — and how to shrink them effectively."
      category="Guide"
      readTime="7 min"
      slug="pdf-file-size-guide"
      relatedTools={[{ href: '/compress', label: 'Compress PDF free' }]}
    >
      <h2>What's actually inside a PDF file?</h2>
      <p>
        A PDF is a container format — it bundles together everything needed to render the document: the text, images, fonts, colour profiles, metadata, and layout instructions. Each of these contributes to file size.
      </p>

      <h2>The main causes of large PDFs</h2>

      <h3>1. High-resolution embedded images (usually the biggest factor)</h3>
      <p>
        If your PDF was created from a design tool or contains photographs, each image is stored at its full resolution. A single 10-megapixel photo stored at 300 DPI can add 5–15 MB to a PDF. Most documents shared on screen don't need more than 96–150 DPI, but creators often export at 300 DPI "to be safe."
      </p>
      <p>
        Fix: <Link href="/compress">Compress the PDF</Link> to downsample images to screen or balanced quality.
      </p>

      <h3>2. Scanned pages</h3>
      <p>
        A scanned PDF is essentially a collection of photographs — each page is a high-resolution image. A 300 DPI A4 scan is a 2480×3508 pixel image. At that resolution, even with JPEG compression, each page can be 1–3 MB. A 20-page scanned document can easily be 30–60 MB.
      </p>
      <p>
        Fix: compress the PDF to reduce scan resolution, or re-scan at 150 DPI if print quality isn't needed.
      </p>

      <h3>3. Embedded fonts</h3>
      <p>
        PDFs embed the fonts used in the document so recipients don't need them installed. Each embedded font adds 50–500 KB. A document using 8 different fonts might add 2–4 MB from fonts alone.
      </p>
      <p>
        PDF font subsetting (embedding only the characters used) reduces this significantly. Most modern PDF creators do this automatically.
      </p>
      <p>
        Fix: use fewer fonts, or use a compression tool that optimises font embedding.
      </p>

      <h3>4. Dead objects and revision history</h3>
      <p>
        When content is deleted from a PDF, the old data is often marked as deleted but not actually removed — it remains in the file. PDFs created by editing tools (Acrobat, Preview) accumulate these "dead objects" over time. A PDF that's been edited many times can be 2–3× larger than necessary.
      </p>
      <p>
        Fix: re-saving through a clean tool (like <Link href="/compress">PdfOnlineStudio Compress PDF</Link>) removes dead objects and restructures the file.
      </p>

      <h3>5. Embedded ICC colour profiles</h3>
      <p>
        Professional print PDFs often include ICC colour profiles for precise colour management. These can add 2–4 MB. For screen use, colour profiles are usually unnecessary.
      </p>

      <h3>6. Metadata and XMP data</h3>
      <p>
        PDFs contain metadata: author, creation date, software used, edit history, and sometimes thumbnail images. This is usually small (under 100 KB) but can accumulate.
      </p>

      <h3>7. Embedded media</h3>
      <p>
        PDFs can contain embedded audio, video, or 3D objects. These are rare but can make files enormous (100 MB+). If you don't need the embedded media, removing it dramatically shrinks the file.
      </p>

      <h2>Expected file sizes by document type</h2>
      <ul>
        <li><strong>Text-only document (no images)</strong>: 50–200 KB per page</li>
        <li><strong>Business document with some images</strong>: 200 KB–1 MB per page</li>
        <li><strong>Scanned document (black & white)</strong>: 100–400 KB per page at 150 DPI</li>
        <li><strong>Scanned document (colour)</strong>: 300 KB–2 MB per page at 150 DPI</li>
        <li><strong>Design/marketing brochure</strong>: 1–10 MB per page</li>
        <li><strong>Print-ready PDF with 300 DPI images</strong>: 5–20 MB per page</li>
      </ul>

      <h2>How much can compression actually reduce a PDF?</h2>
      <p>
        Results vary widely depending on what's in the file:
      </p>
      <ul>
        <li><strong>Image-heavy PDF at 300 DPI</strong> → 60–75% smaller at screen quality</li>
        <li><strong>Scanned document</strong> → 40–65% smaller with balanced compression</li>
        <li><strong>Text-only PDF</strong> → 10–20% smaller (mostly from removing dead objects)</li>
        <li><strong>Already-compressed PDF</strong> → minimal further reduction</li>
      </ul>

      <h2>When compression isn't the answer</h2>
      <p>
        If a PDF is large because it's a print-ready brochure at 300 DPI, compressing it for screen use destroys the quality needed for printing. In that case, maintain two versions: a high-quality print version and a compressed screen version.
      </p>
      <p>
        For very large files (100 MB+), consider splitting the document into chapters (<Link href="/split">Split PDF</Link>) or sharing via a cloud link rather than compressing.
      </p>

      <h2>Preventing large PDFs at source</h2>
      <ul>
        <li>In Word/Google Docs, select "Minimum size" when exporting to PDF (reduces image resolution)</li>
        <li>Use 150 DPI images in your source document instead of 300 DPI</li>
        <li>Limit the number of custom fonts used</li>
        <li>In InDesign or Illustrator, use the "Smallest File Size" PDF preset for screen distribution</li>
        <li>Scan at 150 DPI (not 300) for documents that will only be read on screen</li>
      </ul>
    </ArticleLayout>
  );
}
