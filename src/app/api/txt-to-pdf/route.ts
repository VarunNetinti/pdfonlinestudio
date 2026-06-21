import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 56, FONT_SIZE = 11;

function wrapLine(text: string, font: import('pdf-lib').PDFFont, size: number, maxW: number): string[] {
  if (!text.trim()) return [''];
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    try {
      if (font.widthOfTextAtSize(test, size) > maxW && cur) { lines.push(cur); cur = w; }
      else cur = test;
    } catch { cur = test; }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file     = formData.get('file') as File | null;
    const fontSize = Math.max(8, Math.min(18, parseInt((formData.get('fontSize') as string) || '11', 10)));

    if (!file) return NextResponse.json({ error: 'No text file provided' }, { status: 400 });

    const text    = await file.text();
    const lines   = text.split(/\r?\n/);
    const pdfDoc  = await PDFDocument.create();
    const font    = await pdfDoc.embedFont(StandardFonts.CourierPrime || StandardFonts.Courier);
    const maxW    = PAGE_W - MARGIN * 2;
    const lineH   = fontSize * 1.4;

    let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    let y    = PAGE_H - MARGIN;

    for (const rawLine of lines) {
      const wrapped = rawLine.length === 0 ? [''] : wrapLine(rawLine, font, fontSize, maxW);
      for (const wl of wrapped) {
        if (y - fontSize < MARGIN) { page = pdfDoc.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN; }
        if (wl.trim()) {
          try {
            page.drawText(wl, { x: MARGIN, y: y - fontSize, size: fontSize, font, color: rgb(0.07, 0.07, 0.07) });
          } catch { /* skip unencodable chars */ }
        }
        y -= lineH;
      }
    }

    const result = await pdfDoc.save();
    const outName = file.name.replace(/\.(txt|text|md|csv)$/i, '.pdf');
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${outName}"`,
        'Content-Length': String(result.length),
      },
    });
  } catch (err) {
    console.error('[txt-to-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
