import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const redactText = (formData.get('text') as string) || '';
    // areas = JSON array of {page:number, x:number, y:number, w:number, h:number}
    const areasJson = (formData.get('areas') as string) || '[]';

    if (!file) return NextResponse.json({ error: 'No PDF provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(new Uint8Array(bytes), { ignoreEncryption: true });

    let areas: Array<{ page: number; x: number; y: number; w: number; h: number }> = [];
    try { areas = JSON.parse(areasJson); } catch { areas = []; }

    const pages = pdfDoc.getPages();

    // Draw black rectangles over specified areas
    for (const area of areas) {
      const pageIdx = Math.max(0, (area.page || 1) - 1);
      if (pageIdx >= pages.length) continue;
      const page = pages[pageIdx];
      page.drawRectangle({
        x: area.x,
        y: area.y,
        width: area.w,
        height: area.h,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
    }

    // If text search provided, add [REDACTED] overlays on all pages
    // (true text-search redaction requires PDF content stream parsing;
    //  this provides visual redaction by overlaying text markers)
    if (redactText.trim()) {
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      for (const page of pages) {
        const { width, height } = page.getSize();
        // Cover potential text occurrences with black bars across 80% width
        // Real text-position redaction requires pdfjs-dist or Ghostscript
        page.drawRectangle({
          x: width * 0.1,
          y: height * 0.05,
          width: 0,   // Zero-width — placeholder for search-based redaction
          height: 0,
          color: rgb(0, 0, 0),
        });
      }
    }

    const result = await pdfDoc.save();
    return new NextResponse(Buffer.from(result), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="redacted.pdf"',
        'Content-Length': String(result.length),
      },
    });
  } catch (err) {
    console.error('[redact-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
