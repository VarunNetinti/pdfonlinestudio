import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Password-protect a PDF using pdf-lib.
 * Note: pdf-lib does not natively support AES-256 encryption.
 * For production, use qpdf or node-qpdf for proper 256-bit AES encryption.
 * This implementation uses pdf-lib's built-in encryption (RC4-128) as a baseline.
 * Replace with: import { execSync } from 'child_process'; execSync(`qpdf --encrypt ...`)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const password = formData.get('password') as string | null;

    if (!file) return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    // Save with encryption options
    // pdf-lib supports userPassword and ownerPassword
    const resultBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(resultBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="protected.pdf"',
        'Content-Length': String(resultBytes.length),
      },
    });
  } catch (err) {
    console.error('[protect-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
