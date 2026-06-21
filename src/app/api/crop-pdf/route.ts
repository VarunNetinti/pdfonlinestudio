import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file    = formData.get('file')   as File   | null;
    // Crop values as percentage of page dimensions (0–100)
    const topPct    = parseFloat((formData.get('top')    as string) || '0');
    const rightPct  = parseFloat((formData.get('right')  as string) || '0');
    const bottomPct = parseFloat((formData.get('bottom') as string) || '0');
    const leftPct   = parseFloat((formData.get('left')   as string) || '0');
    const applyTo   = (formData.get('applyTo') as string) || 'all'; // 'all' | '1-indexed range'

    if (!file) return NextResponse.json({ error: 'No PDF provided' }, { status: 400 });
    if (topPct + bottomPct >= 100 || leftPct + rightPct >= 100) {
      return NextResponse.json({ error: 'Crop margins too large — nothing would remain' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(new Uint8Array(bytes), { ignoreEncryption: true });
    const pages  = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      const pg = pages[i];
      const { width, height } = pg.getSize();

      // Convert percentages to absolute points
      const cropLeft   = (leftPct   / 100) * width;
      const cropBottom = (bottomPct / 100) * height;
      const cropRight  = width  - (rightPct / 100) * width;
      const cropTop    = height - (topPct   / 100) * height;

      // Set CropBox — this is how PDF viewers crop visible area
      pg.setCropBox(cropLeft, cropBottom, cropRight - cropLeft, cropTop - cropBottom);
      // Also set MediaBox to match for maximum compatibility
      pg.setMediaBox(cropLeft, cropBottom, cropRight - cropLeft, cropTop - cropBottom);
    }

    const result = await pdfDoc.save();
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cropped.pdf"',
        'Content-Length': String(result.length),
      },
    });
  } catch (err) {
    console.error('[crop-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
