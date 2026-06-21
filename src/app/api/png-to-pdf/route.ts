import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_SIZES: Record<string, [number, number]> = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const pageSize = (formData.get('pageSize') as string) || 'A4';

    if (!files.length) return NextResponse.json({ error: 'No image files provided' }, { status: 400 });

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const mimeType = file.type;
      const isImage = mimeType.startsWith('image/') ||
        /\.(png|jpg|jpeg|webp)$/i.test(file.name);
      if (!isImage) continue;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert to JPEG using sharp for consistent embedding
      const jpegBuffer = await sharp(buffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } }) // flatten transparency for JPEG
        .jpeg({ quality: 90 })
        .toBuffer();

      const metadata = await sharp(buffer).metadata();
      const imgWidth = metadata.width || 800;
      const imgHeight = metadata.height || 600;

      let pageW: number, pageH: number;
      if (pageSize === 'fit') {
        pageW = imgWidth;
        pageH = imgHeight;
      } else {
        [pageW, pageH] = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;
      }

      const page = pdfDoc.addPage([pageW, pageH]);
      const img = await pdfDoc.embedJpg(jpegBuffer);

      // Scale image to fit page with margins
      const margin = pageSize === 'fit' ? 0 : 20;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      const scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);
      const drawW = imgWidth * scale;
      const drawH = imgHeight * scale;
      const x = margin + (maxW - drawW) / 2;
      const y = margin + (maxH - drawH) / 2;

      page.drawImage(img, { x, y, width: drawW, height: drawH });
    }

    if (pdfDoc.getPageCount() === 0) {
      return NextResponse.json({ error: 'No valid images found in upload' }, { status: 400 });
    }

    const bytes = await pdfDoc.save();

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="images.pdf"',
        'Content-Length': String(bytes.length),
      },
    });
  } catch (err) {
    console.error('[png-to-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
