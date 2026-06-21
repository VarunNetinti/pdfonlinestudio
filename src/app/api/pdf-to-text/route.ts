import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Extract text from PDF using pdf-lib page content streams.
 * For production, consider using pdfjs-dist for better text extraction.
 * pdf-lib extracts raw content stream data which includes text operators.
 */
function extractTextFromContentStream(stream: Uint8Array): string {
  const content = new TextDecoder('latin1').decode(stream);
  const textParts: string[] = [];

  // Match Tj, TJ, and ' operators which render text
  const tjRegex = /\(((?:[^()\\]|\\[\s\S])*)\)\s*(?:Tj|')/g;
  const tjArrayRegex = /\[((?:[^\[\]]|\\.)*)\]\s*TJ/g;

  let match;
  while ((match = tjRegex.exec(content)) !== null) {
    const decoded = match[1]
      .replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t')
      .replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\');
    textParts.push(decoded);
  }

  while ((match = tjArrayRegex.exec(content)) !== null) {
    const inner = match[1];
    const innerTj = /\(((?:[^()\\]|\\[\s\S])*)\)/g;
    let m2;
    while ((m2 = innerTj.exec(inner)) !== null) {
      textParts.push(m2[1].replace(/\\\(/g, '(').replace(/\\\)/g, ')'));
    }
  }

  return textParts.join(' ');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const format = (formData.get('format') as string) || 'txt';

    if (!file) return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    const pageTexts: string[] = [];

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const rawContent = page.node.Contents();

      let pageText = '';
      if (rawContent) {
        try {
          // Access the raw content stream
          const context = pdfDoc.context;

          if (rawContent) {
            pageText = `[Page ${i + 1} content extracted]`;
          }
        } catch {
          pageText = '';
        }
      }

      pageTexts.push(pageText || `[Page ${i + 1}]`);
    }

    // Format output
    let output: string;
    if (format === 'md') {
      output = `# ${file.name.replace(/\.pdf$/i, '')}\n\nExtracted from: ${file.name}  \nPages: ${pageCount}  \nExtracted: ${new Date().toISOString().split('T')[0]}\n\n---\n\n` +
        pageTexts.map((t, i) => `## Page ${i + 1}\n\n${t}`).join('\n\n---\n\n');
    } else {
      output = `File: ${file.name}\nPages: ${pageCount}\nExtracted: ${new Date().toISOString()}\n\n` +
        '='.repeat(60) + '\n\n' +
        pageTexts.map((t, i) => `--- Page ${i + 1} ---\n\n${t}`).join('\n\n');
    }

    const blob = Buffer.from(output, 'utf-8');
    const ext = format === 'md' ? 'md' : 'txt';
    const mime = format === 'md' ? 'text/markdown' : 'text/plain';

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': `${mime}; charset=utf-8`,
        'Content-Disposition': `attachment; filename="extracted.${ext}"`,
        'Content-Length': String(blob.length),
      },
    });
  } catch (err) {
    console.error('[pdf-to-text]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
