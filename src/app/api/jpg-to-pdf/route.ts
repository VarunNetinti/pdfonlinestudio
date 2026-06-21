import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, PageSizes } from 'pdf-lib';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Page size presets (in PDF points: 1pt = 1/72 inch)
const PAGE_SIZES: Record<string, [number, number]> = {
  A4: PageSizes.A4,
  Letter: PageSizes.Letter,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const pageSizeKey = (formData.get('pageSize') as string) || 'A4';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No image files provided' }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      try {
        const bytes = await file.arrayBuffer();
        const imgBuffer = Buffer.from(bytes);

        // Use sharp to normalise + get dimensions
        const sharpImg = sharp(imgBuffer);
        const meta = await sharpImg.metadata();
        const jpegBuffer = await sharpImg.rotate().jpeg({ quality: 90 }).toBuffer();
        const { width: imgW = 800, height: imgH = 600 } = meta;

        let page;

        if (pageSizeKey === 'fit') {
          // Page fits exactly the image dimensions (convert pixels to pt at 72 dpi)
          page = pdfDoc.addPage([imgW, imgH]);
        } else {
          const [pageW, pageH] = PAGE_SIZES[pageSizeKey] ?? PageSizes.A4;
          page = pdfDoc.addPage([pageW, pageH]);
        }

        const { width: pageW, height: pageH } = page.getSize();

        // Embed image
        const embeddedImg = await pdfDoc.embedJpg(jpegBuffer);

        // Scale image to fill the page while preserving aspect ratio
        const imgAspect = imgW / imgH;
        const pageAspect = pageW / pageH;

        let drawW: number, drawH: number, x: number, y: number;
        if (imgAspect > pageAspect) {
          drawW = pageW;
          drawH = pageW / imgAspect;
        } else {
          drawH = pageH;
          drawW = pageH * imgAspect;
        }

        // Centre the image
        x = (pageW - drawW) / 2;
        y = (pageH - drawH) / 2;

        page.drawImage(embeddedImg, { x, y, width: drawW, height: drawH });
      } catch (imgErr) {
        console.warn(`Skipping image ${file.name}:`, imgErr);
        // Skip invalid images gracefully
      }
    }

    if (pdfDoc.getPageCount() === 0) {
      return NextResponse.json({ error: 'No valid images could be processed' }, { status: 400 });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="images.pdf"',
        'Content-Length': String(pdfBytes.length),
      },
    });
  } catch (err) {
    console.error('[jpg-to-pdf]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
