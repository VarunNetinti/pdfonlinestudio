import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const password = formData.get('password') as string | null;

    if (!file) return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    if (!password) return NextResponse.json({ error: 'Password is required' }, { status: 400 });

    const bytes = await file.arrayBuffer();

    let pdfDoc: PDFDocument;
    try {
      pdfDoc = await PDFDocument.load(bytes, {
        ignoreEncryption: false,
        password: password,
      });
    } catch {
      return NextResponse.json({ error: 'Incorrect password. Please check and try again.' }, { status: 401 });
    }

    // Re-save without password
    const resultBytes = await pdfDoc.save();

    return new NextResponse(resultBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="unlocked.pdf"',
        'Content-Length': String(resultBytes.length),
      },
    });
  } catch (err) {
    console.error('[unlock-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
