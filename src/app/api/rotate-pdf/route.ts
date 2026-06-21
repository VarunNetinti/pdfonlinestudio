import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseRange(rangeStr: string, totalPages: number): number[] {
  const pages: number[] = [];
  const parts = rangeStr.split(',').map(s => s.trim());
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
      for (let i = start; i <= Math.min(end, totalPages); i++) pages.push(i - 1);
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= totalPages) pages.push(n - 1);
    }
  }
  return [...new Set(pages)];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const degreesStr = formData.get('degrees') as string || '90';
    const pagesMode = formData.get('pages') as string || 'all';
    const rangeStr = formData.get('range') as string || '';

    if (!file) return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });

    const rotationDeg = parseInt(degreesStr, 10);
    if (![90, 180, 270].includes(rotationDeg)) {
      return NextResponse.json({ error: 'Invalid rotation. Use 90, 180, or 270.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    const pagesToRotate = pagesMode === 'custom' && rangeStr
      ? parseRange(rangeStr, pageCount)
      : Array.from({ length: pageCount }, (_, i) => i);

    for (const idx of pagesToRotate) {
      if (idx >= 0 && idx < pageCount) {
        const page = pdfDoc.getPage(idx);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotationDeg) % 360));
      }
    }

    const resultBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(resultBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="rotated.pdf"',
        'Content-Length': String(resultBytes.length),
      },
    });
  } catch (err) {
    console.error('[rotate-pdf]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
