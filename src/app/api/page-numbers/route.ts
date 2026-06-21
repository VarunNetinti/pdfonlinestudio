import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Position = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';

function formatNumber(fmt: string, current: number, total: number): string {
  return fmt
    .replace('Page', 'Page')
    .replace('1', String(current))
    .replace('N', String(total))
    // Handle all formats
    .replace(/\b1\b/, String(current))
    .replace(/\bN\b/, String(total));
}

// Simple format replacement
function applyFormat(template: string, current: number, total: number): string {
  if (template === '1') return String(current);
  if (template === 'Page 1') return `Page ${current}`;
  if (template === '1 / N') return `${current} / ${total}`;
  if (template === 'Page 1 of N') return `Page ${current} of ${total}`;
  return String(current);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const position = (formData.get('position') as Position) || 'bottom-center';
    const format = (formData.get('format') as string) || '1';
    const startAt = parseInt(formData.get('startAt') as string || '1', 10);

    if (!file) return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pageCount = pdfDoc.getPageCount();
    const fontSize = 10;
    const margin = 24;

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const text = applyFormat(format, i + startAt, pageCount + startAt - 1);
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      let x: number, y: number;
      const isBottom = position.startsWith('bottom');
      const isTop = position.startsWith('top');
      const isCenter = position.endsWith('center');
      const isRight = position.endsWith('right');
      const isLeft = position.endsWith('left');

      if (isBottom) y = margin;
      else if (isTop) y = height - margin - fontSize;
      else y = margin;

      if (isCenter) x = (width - textWidth) / 2;
      else if (isRight) x = width - margin - textWidth;
      else x = margin;

      page.drawText(text, {
        x, y,
        size: fontSize,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    const resultBytes = await pdfDoc.save();

    return new NextResponse(resultBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="numbered.pdf"',
        'Content-Length': String(resultBytes.length),
      },
    });
  } catch (err) {
    console.error('[page-numbers]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
