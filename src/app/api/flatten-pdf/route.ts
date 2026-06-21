import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No PDF provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(new Uint8Array(bytes), { ignoreEncryption: true });

    // Flatten all AcroForm fields — makes form values permanent, uneditable
    const form = pdfDoc.getForm();
    try {
      form.flatten();
    } catch {
      // PDF may have no form fields — not an error
    }

    // Also remove interactive annotations by rebuilding each page's annotation array
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      try {
        const annots = page.node.get(pdfDoc.context.obj('Annots'));
        if (annots) {
          page.node.delete(pdfDoc.context.obj('Annots'));
        }
      } catch {
        // Skip pages where annotation removal fails
      }
    }

    const result = await pdfDoc.save({ useObjectStreams: true });
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="flattened.pdf"',
        'Content-Length': String(result.length),
      },
    });
  } catch (err) {
    console.error('[flatten-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
