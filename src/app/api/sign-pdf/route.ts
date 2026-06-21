import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file      = formData.get('file')      as File   | null;
    const sigText   = (formData.get('sigText')  as string) || '';
    const sigImageFile = formData.get('sigImage') as File | null;
    const page      = parseInt((formData.get('page') as string) || '1', 10);
    const xPct      = parseFloat((formData.get('xPct') as string) || '10');  // % from left
    const yPct      = parseFloat((formData.get('yPct') as string) || '10');  // % from bottom
    const sigWidth  = parseFloat((formData.get('width')  as string) || '30'); // % of page width
    const sigHeight = parseFloat((formData.get('height') as string) || '8');  // % of page height

    if (!file) return NextResponse.json({ error: 'No PDF provided' }, { status: 400 });
    if (!sigText && !sigImageFile) return NextResponse.json({ error: 'Provide signature text or image' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(new Uint8Array(bytes), { ignoreEncryption: true });
    const pages  = pdfDoc.getPages();
    const pageIdx = Math.max(0, page - 1);
    if (pageIdx >= pages.length) return NextResponse.json({ error: 'Page out of range' }, { status: 400 });

    const pg = pages[pageIdx];
    const { width, height } = pg.getSize();
    const x = (xPct / 100) * width;
    const y = (yPct / 100) * height;
    const w = (sigWidth / 100) * width;
    const h = (sigHeight / 100) * height;

    if (sigImageFile) {
      // Embed signature image (PNG or JPG)
      const imgBytes = await sigImageFile.arrayBuffer();
      const mimeType = sigImageFile.type;
      const img = mimeType.includes('png')
        ? await pdfDoc.embedPng(imgBytes)
        : await pdfDoc.embedJpg(imgBytes);

      pg.drawImage(img, { x, y, width: w, height: h });
    } else if (sigText) {
      // Draw typed signature in a cursive-style Helvetica italic
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const fontSize = Math.min(h * 0.6, 36);
      const textW = font.widthOfTextAtSize(sigText, fontSize);

      // Signature underline
      pg.drawLine({
        start: { x, y },
        end:   { x: x + w, y },
        thickness: 1,
        color: rgb(0.2, 0.2, 0.5),
        opacity: 0.6,
      });

      // Signature text
      pg.drawText(sigText, {
        x,
        y: y + 4,
        size: Math.min(fontSize, (w / (textW / fontSize)) * 0.9),
        font,
        color: rgb(0.05, 0.05, 0.4),
      });

      // "Digitally signed" stamp
      const stampFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const now = new Date().toISOString().split('T')[0];
      pg.drawText(`Signed: ${now}`, {
        x,
        y: y - 10,
        size: 6,
        font: stampFont,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    const result = await pdfDoc.save();
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="signed.pdf"',
        'Content-Length': String(result.length),
      },
    });
  } catch (err) {
    console.error('[sign-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
