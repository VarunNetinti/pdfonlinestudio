import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import archiver from 'archiver';
import { Readable } from 'stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const dpiStr = formData.get('dpi') as string || '150';
    const dpi = Math.min(300, Math.max(72, parseInt(dpiStr, 10)));

    if (!file) return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    // Create ZIP containing one PNG per page
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 6 } });

      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', resolve);
      archive.on('error', reject);

      // For each page, create a placeholder PNG
      // In production, use pdf2pic, pdfjs-dist with canvas, or Ghostscript:
      // gs -dNOPAUSE -sDEVICE=pngalpha -r{dpi} -dBATCH -sOutputFile=page-%d.png input.pdf
      const addPages = async () => {
        for (let i = 0; i < pageCount; i++) {
          const page = pdfDoc.getPage(i);
          const { width, height } = page.getSize();

          // Calculate pixel dimensions
          const pxW = Math.round((width / 72) * dpi);
          const pxH = Math.round((height / 72) * dpi);

          // Create a blank white PNG as placeholder
          // Replace this with actual rendering in production
          const pngBuffer = await sharp({
            create: {
              width: Math.min(pxW, 2400),
              height: Math.min(pxH, 3400),
              channels: 4,
              background: { r: 255, g: 255, b: 255, alpha: 1 },
            },
          }).png().toBuffer();

          const pad = String(i + 1).padStart(3, '0');
          archive.append(pngBuffer, { name: `page-${pad}.png` });
        }
        archive.finalize();
      };

      addPages().catch(reject);
    });

    const zipBuffer = Buffer.concat(chunks);

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="pdf-pages.zip"',
        'Content-Length': String(zipBuffer.length),
      },
    });
  } catch (err) {
    console.error('[pdf-to-png]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
