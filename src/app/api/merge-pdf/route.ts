import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
  try {
    // Use Next.js native formData() — never use formidable with NextRequest
    // (formidable expects a Node.js IncomingMessage, not a Web Request)
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseErr) {
      return NextResponse.json(
        { error: 'Failed to parse uploaded files. Please try again.' },
        { status: 400 }
      );
    }

    const pdfFiles = formData.getAll('files') as File[];

    if (!pdfFiles || pdfFiles.length < 2) {
      return NextResponse.json(
        { error: 'Please provide at least 2 PDF files' },
        { status: 400 }
      );
    }

    const mergedPdf = await PDFDocument.create();
    let pageCount = 0;
    const errors: string[] = [];

    for (const file of pdfFiles) {
      if (!file || typeof file.arrayBuffer !== 'function') continue;

      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        errors.push(`"${file.name}" is not a PDF — skipped`);
        continue;
      }

      try {
        const bytes = await file.arrayBuffer();
        const srcDoc = await PDFDocument.load(new Uint8Array(bytes), {
          ignoreEncryption: true,
        });
        const indices = srcDoc.getPageIndices();
        const copied = await mergedPdf.copyPages(srcDoc, indices);
        copied.forEach((page) => mergedPdf.addPage(page));
        pageCount += indices.length;
      } catch (fileErr) {
        const msg = fileErr instanceof Error ? fileErr.message : String(fileErr);
        errors.push(`"${file.name}" could not be read: ${msg}`);
        console.warn(`[merge-pdf] Skipping "${file.name}":`, fileErr);
      }
    }

    if (pageCount === 0) {
      return NextResponse.json(
        {
          error:
            errors.length > 0
              ? `No valid pages found. ${errors[0]}`
              : 'No valid PDF pages could be extracted.',
        },
        { status: 400 }
      );
    }

    const mergedBytes = await mergedPdf.save();

    return new NextResponse(Buffer.from(mergedBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
        'Content-Length': String(mergedBytes.length),
      },
    });
  } catch (err) {
    console.error('[merge-pdf] Unexpected error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
