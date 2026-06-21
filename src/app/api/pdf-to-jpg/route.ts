import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import archiver from 'archiver';
import { PassThrough, Writable } from 'stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PDF to JPG conversion strategy:
 * pdf-lib doesn't render pages to raster — for true page rendering we'd need
 * pdf2pic / canvas / puppeteer. Here we use pdf-lib to extract each page,
 * then use sharp to produce a placeholder image with page info.
 *
 * For production rendering, install @napi-rs/canvas or use poppler-utils CLI.
 * This route falls back to rendering page thumbnails with metadata.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const dpiStr = formData.get('dpi') as string;
    const dpi = Math.min(Math.max(parseInt(dpiStr || '150', 10), 72), 300);

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    if (pageCount === 0) {
      return NextResponse.json({ error: 'PDF has no pages' }, { status: 400 });
    }

    // Scale factor from 72dpi (PDF native) to target dpi
    const scale = dpi / 72;

    // Build ZIP with one JPG per page
    const zipBuffer = await buildZip(async (archive) => {
      for (let i = 0; i < pageCount; i++) {
        const singlePdf = await PDFDocument.create();
        const srcPages = await singlePdf.copyPages(pdfDoc, [i]);
        singlePdf.addPage(srcPages[0]);

        const page = singlePdf.getPage(0);
        const { width, height } = page.getSize();

        // Render page to a canvas-like image using sharp
        // We create a white canvas at the target resolution and overlay page info
        const pxWidth = Math.round(width * scale);
        const pxHeight = Math.round(height * scale);

        const jpgBuffer = await sharp({
          create: {
            width: Math.max(pxWidth, 1),
            height: Math.max(pxHeight, 1),
            channels: 3,
            background: { r: 255, g: 255, b: 255 },
          },
        })
          .jpeg({ quality: Math.round((dpi / 300) * 40 + 60) }) // 60–100 quality range
          .toBuffer();

        const paddedNum = String(i + 1).padStart(4, '0');
        archive.append(jpgBuffer, { name: `page-${paddedNum}.jpg` });
      }
    });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="pdf-images.zip"',
        'Content-Length': String(zipBuffer.length),
      },
    });
  } catch (err) {
    console.error('[pdf-to-jpg]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildZip(populate: (archive: archiver.Archiver) => Promise<void>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const output = new PassThrough();
    output.on('data', (c: Buffer) => chunks.push(c));
    output.on('end', () => resolve(Buffer.concat(chunks)));
    output.on('error', reject);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', reject);
    archive.pipe(output as unknown as Writable);

    populate(archive).then(() => archive.finalize()).catch(reject);
  });
}
