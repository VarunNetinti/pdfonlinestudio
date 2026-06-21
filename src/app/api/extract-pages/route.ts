import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { parsePageRange } from '@/lib/fileUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const pagesInput = (formData.get('pages') as string) || '';
    const asSingle = formData.get('asSingle') === 'true';

    if (!file) return NextResponse.json({ error: 'No PDF provided' }, { status: 400 });
    if (!pagesInput.trim()) return NextResponse.json({ error: 'No pages specified' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(new Uint8Array(bytes), { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();
    const indices = parsePageRange(pagesInput, totalPages);

    if (indices.length === 0) return NextResponse.json({ error: 'No valid pages specified' }, { status: 400 });

    if (asSingle || indices.length === 1) {
      // Extract into a single PDF
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach(p => newDoc.addPage(p));
      const result = await newDoc.save();
      return new NextResponse(Buffer.from(result), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="extracted.pdf"',
          'Content-Length': String(result.length),
        },
      });
    }

    // Multiple pages → ZIP of individual PDFs
    const archiver = (await import('archiver')).default;
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 6 } });
      archive.on('data', (c: Buffer) => chunks.push(c));
      archive.on('end', resolve);
      archive.on('error', reject);

      const addAll = async () => {
        for (let n = 0; n < indices.length; n++) {
          const doc = await PDFDocument.create();
          const [pg] = await doc.copyPages(srcDoc, [indices[n]]);
          doc.addPage(pg);
          const buf = Buffer.from(await doc.save());
          archive.append(buf, { name: `page-${String(indices[n] + 1).padStart(3, '0')}.pdf` });
        }
        archive.finalize();
      };
      addAll().catch(reject);
    });

    const zip = Buffer.concat(chunks);
    return new NextResponse(zip, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="extracted-pages.zip"',
        'Content-Length': String(zip.length),
      },
    });
  } catch (err) {
    console.error('[extract-pages]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
