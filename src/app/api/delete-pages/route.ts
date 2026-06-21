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

    if (!file) return NextResponse.json({ error: 'No PDF provided' }, { status: 400 });
    if (!pagesInput.trim()) return NextResponse.json({ error: 'No pages specified' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(new Uint8Array(bytes), { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    const toDelete = new Set(parsePageRange(pagesInput, totalPages));
    if (toDelete.size === 0) return NextResponse.json({ error: 'No valid pages specified' }, { status: 400 });
    if (toDelete.size >= totalPages) return NextResponse.json({ error: 'Cannot delete all pages' }, { status: 400 });

    // Build new doc with kept pages
    const newDoc = await PDFDocument.create();
    const keepIndices = Array.from({ length: totalPages }, (_, i) => i).filter(i => !toDelete.has(i));
    const copied = await newDoc.copyPages(srcDoc, keepIndices);
    copied.forEach(p => newDoc.addPage(p));

    const result = await newDoc.save();
    return new NextResponse(Buffer.from(result), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="deleted-pages.pdf"',
        'Content-Length': String(result.length),
      },
    });
  } catch (err) {
    console.error('[delete-pages]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
