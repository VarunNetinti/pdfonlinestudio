import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, degrees, PDFFont, StandardFonts } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const text = (formData.get('text') as string || 'CONFIDENTIAL').trim();
    const opacity = Math.min(1, Math.max(0, parseInt(formData.get('opacity') as string || '30', 10) / 100));
    const position = (formData.get('position') as Position) || 'center';
    const fontSize = parseInt(formData.get('fontSize') as string || '48', 10);

    if (!file) return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    if (!text) return NextResponse.json({ error: 'Watermark text is required' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);
      const margin = 40;

      let x: number, y: number, rotation = 0;

      switch (position) {
        case 'top-left':
          x = margin; y = height - margin - textHeight; break;
        case 'top-right':
          x = width - margin - textWidth; y = height - margin - textHeight; break;
        case 'bottom-left':
          x = margin; y = margin; break;
        case 'bottom-right':
          x = width - margin - textWidth; y = margin; break;
        case 'center':
        default:
          x = (width - textWidth * Math.cos(Math.PI / 4) + textHeight * Math.sin(Math.PI / 4)) / 2;
          y = (height - textWidth * Math.sin(Math.PI / 4) - textHeight * Math.cos(Math.PI / 4)) / 2;
          rotation = 45;
      }

      page.drawText(text, {
        x, y,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(rotation),
      });
    }

    const resultBytes = await pdfDoc.save();

    return new NextResponse(resultBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="watermarked.pdf"',
        'Content-Length': String(resultBytes.length),
      },
    });
  } catch (err) {
    console.error('[watermark-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
