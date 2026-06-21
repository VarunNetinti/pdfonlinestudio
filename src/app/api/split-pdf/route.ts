import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import archiver from 'archiver';
import { Writable, PassThrough } from 'stream';
import { parsePageRange } from '@/lib/fileUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const mode = (formData.get('mode') as string) || 'all';
    const rangeInput = (formData.get('range') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    if (totalPages === 0) {
      return NextResponse.json({ error: 'PDF has no pages' }, { status: 400 });
    }

    // Determine which pages to extract
    let pageIndices: number[] = [];
    if (mode === 'range' && rangeInput.trim()) {
      pageIndices = parsePageRange(rangeInput, totalPages);
      if (pageIndices.length === 0) {
        return NextResponse.json({ error: 'No valid page range specified' }, { status: 400 });
      }
    } else {
      // Split ALL pages
      pageIndices = Array.from({ length: totalPages }, (_, i) => i);
    }

    // Build a ZIP archive containing one PDF per page
    const zipBuffer = await buildZip(async (archive) => {
      for (const pageIdx of pageIndices) {
        const singlePdf = await PDFDocument.create();
        const [copiedPage] = await singlePdf.copyPages(srcDoc, [pageIdx]);
        singlePdf.addPage(copiedPage);

        const pdfBytes = await singlePdf.save();
        const paddedNum = String(pageIdx + 1).padStart(4, '0');
        archive.append(Buffer.from(pdfBytes), { name: `page-${paddedNum}.pdf` });
      }
    });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="split-pages.zip"',
        'Content-Length': String(zipBuffer.length),
      },
    });
  } catch (err) {
    console.error('[split-pdf]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Build a zip archive in memory, returns a Buffer */
function buildZip(populate: (archive: archiver.Archiver) => Promise<void>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const output = new PassThrough();

    output.on('data', (chunk: Buffer) => chunks.push(chunk));
    output.on('end', () => resolve(Buffer.concat(chunks)));
    output.on('error', reject);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', reject);
    archive.pipe(output as unknown as Writable);

    populate(archive)
      .then(() => archive.finalize())
      .catch(reject);
  });
}
