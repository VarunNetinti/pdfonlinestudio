import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'PDF Accessibility: How to Make PDFs Readable for Everyone',
  description: 'Create accessible PDFs with proper tags, alt text, reading order, and contrast. WCAG compliance and screen reader best practices for PDF documents.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/pdf-accessibility-guide' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="PDF Accessibility: How to Make PDFs Readable for Everyone"
      description="How to create accessible PDFs with proper tags, alt text, reading order, and contrast — for screen readers and compliance."
      category="Guide"
      readTime="8 min"
      slug="pdf-accessibility-guide"
      relatedTools={[
        { href: '/compress', label: 'Compress PDF' },
        { href: '/page-numbers', label: 'Add page numbers' },
      ]}
    >
      <h2>Why PDF accessibility matters</h2>
      <p>
        An estimated 1.3 billion people worldwide live with some form of visual impairment. Screen readers — software that reads document content aloud — are essential tools for blind and visually impaired users. Without proper accessibility features, PDFs can be completely unusable for these users.
      </p>
      <p>
        Beyond moral considerations, PDF accessibility is often legally required. In the US, Section 508 of the Rehabilitation Act mandates accessible electronic documents for federal agencies. The EU has similar requirements under the Web Accessibility Directive. Many organisations are also subject to WCAG (Web Content Accessibility Guidelines) requirements.
      </p>

      <h2>What makes a PDF accessible?</h2>
      <p>
        An accessible PDF has several key properties:
      </p>
      <ul>
        <li><strong>Proper document tags</strong> — a logical structure (headings, paragraphs, lists) that screen readers can navigate</li>
        <li><strong>Reading order</strong> — content flows logically even for screen readers that process the file linearly</li>
        <li><strong>Alt text on images</strong> — descriptions for all meaningful images</li>
        <li><strong>Sufficient colour contrast</strong> — text must be distinguishable from backgrounds (WCAG AA: 4.5:1 ratio)</li>
        <li><strong>Bookmarks for navigation</strong> — especially in long documents</li>
        <li><strong>Language metadata</strong> — the document's language is specified so screen readers pronounce words correctly</li>
        <li><strong>No reliance on colour alone</strong> — information communicated by colour must also be conveyed another way</li>
        <li><strong>Searchable text</strong> — scanned PDFs without OCR are completely inaccessible</li>
      </ul>

      <h2>Tagged PDFs: the foundation of accessibility</h2>
      <p>
        PDF tags are an invisible layer of semantic structure that tells assistive technology what each piece of content represents. A tagged PDF has markup like: "this is a level-1 heading", "this is a paragraph", "this is a table with these header cells."
      </p>
      <p>
        Without tags, a screen reader encounters a flat stream of text with no indication of structure. Headings, paragraphs, list items, and table cells all sound the same.
      </p>

      <h3>How to create tagged PDFs</h3>
      <ul>
        <li>
          <strong>Microsoft Word</strong>: Save As PDF → Options → "Document structure tags for accessibility" (checked by default in newer versions). Use proper Heading styles (Heading 1, Heading 2, etc.) in the Word document — these become PDF tags automatically.
        </li>
        <li>
          <strong>Google Docs</strong>: File → Download → PDF Document. Tags are created automatically from document structure.
        </li>
        <li>
          <strong>Adobe InDesign</strong>: Export to PDF with "Create Tagged PDF" checked. Map paragraph styles to PDF tags in the Articles panel for correct reading order.
        </li>
        <li>
          <strong>Adobe Acrobat Pro</strong>: Tools → Accessibility → Add Tags to Document (automatic tagging, then review and correct manually).
        </li>
      </ul>

      <h2>Adding alt text to images</h2>
      <p>
        Every meaningful image in a PDF needs alt text — a description of what the image contains or conveys. Decorative images (borders, dividers, background patterns) should be marked as decorative so screen readers skip them.
      </p>

      <h3>Alt text guidelines</h3>
      <ul>
        <li>Describe what the image shows, not what it looks like ("Bar chart showing quarterly revenue growth from 2022–2024" not "blue and grey bars")</li>
        <li>For charts and graphs, include the key data or trend the chart illustrates</li>
        <li>Keep alt text concise — 50–150 characters for most images</li>
        <li>Don't start with "Image of..." or "Photo of..." — screen readers already announce it's an image</li>
      </ul>

      <h3>Adding alt text in Word (before PDF export)</h3>
      <ol>
        <li>Right-click the image → Edit Alt Text</li>
        <li>Enter a description, or check "Mark as decorative" for purely decorative images</li>
        <li>The alt text is preserved when you export to PDF</li>
      </ol>

      <h2>Reading order and document structure</h2>
      <p>
        Screen readers process PDF content in "reading order" — the sequence in which content flows through the document. In complex layouts (multiple columns, sidebars, text boxes), the reading order can differ from the visual order, causing confusing results.
      </p>
      <p>
        The safest approach: create documents with simple, linear layouts where possible. Avoid floating text boxes and complex multi-column arrangements that require careful reading order configuration.
      </p>
      <p>
        In Adobe Acrobat Pro, you can view and fix reading order via Tools → Accessibility → Reading Order.
      </p>

      <h2>Colour contrast requirements</h2>
      <p>
        WCAG 2.1 AA requires:
      </p>
      <ul>
        <li><strong>Normal text (under 18pt)</strong>: 4.5:1 contrast ratio minimum</li>
        <li><strong>Large text (18pt or 14pt bold)</strong>: 3:1 contrast ratio minimum</li>
        <li><strong>UI components and graphic elements</strong>: 3:1 contrast ratio minimum</li>
      </ul>
      <p>
        Common failures: light grey text on white backgrounds, coloured text on coloured backgrounds, and text overlaid on photos. Use the WebAIM Contrast Checker (webaim.org/resources/contrastchecker) to verify contrast ratios.
      </p>

      <h2>Scanned PDFs and OCR</h2>
      <p>
        A scanned PDF is essentially a photograph — it contains no machine-readable text at all. Screen readers cannot extract any text from it, making it completely inaccessible.
      </p>
      <p>
        To make a scanned PDF accessible, it must be processed through OCR (optical character recognition) to create a text layer. Adobe Acrobat Pro includes OCR (Tools → Scan & OCR → Recognize Text). Free alternatives include ABBYY FineReader (limited free), Google Drive (right-click PDF → Open with Google Docs for basic OCR), or Tesseract (open-source command-line OCR).
      </p>

      <h2>Checking your PDF's accessibility</h2>
      <p>
        <strong>Adobe Acrobat Pro</strong>: Tools → Accessibility → Full Check — runs a detailed accessibility audit with specific issues listed.
      </p>
      <p>
        <strong>PAC (PDF Accessibility Checker)</strong>: Free tool from the PDF Association that checks against PDF/UA and WCAG standards. Available at pdfua.foundation.
      </p>
      <p>
        <strong>Manual testing</strong>: Open the PDF in a screen reader (NVDA for Windows — free, VoiceOver built into Mac and iOS) and navigate through it. If it sounds confusing or content is missed, there are accessibility issues.
      </p>

      <h2>PDF/UA: the accessibility standard</h2>
      <p>
        PDF/UA (ISO 14289) is the technical standard for universally accessible PDFs. It specifies requirements for tagged content, alt text, metadata, and structure. Documents that comply with PDF/UA pass automated accessibility checkers and are genuinely usable by screen reader users.
      </p>
      <p>
        For government documents, legal submissions, and anything that must meet accessibility legislation, PDF/UA compliance is the target standard.
      </p>

      <h2>Quick wins for better PDF accessibility</h2>
      <ul>
        <li>Use proper Heading styles in Word before exporting — this alone creates the most important accessibility structure</li>
        <li>Add alt text to all non-decorative images in the source document</li>
        <li>Ensure sufficient text contrast (dark text on light backgrounds)</li>
        <li>Include <Link href="/page-numbers">page numbers</Link> for document navigation</li>
        <li>Add a table of contents with bookmarks in long documents</li>
        <li>Specify the document language in File → Properties → Description → Language</li>
      </ul>
    </ArticleLayout>
  );
}
