import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Compress PDF by:
 * 1. Re-serializing through pdf-lib (removes dead objects, normalises structure)
 * 2. For image-heavy PDFs, re-compress embedded images via sharp
 *
 * Note: pdf-lib alone gives 10-30% reduction. For deeper compression,
 * Ghostscript/mutool would be needed. This approach is dependency-light.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const quality = (formData.get('quality') as string) || 'medium';

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    // Quality → JPEG compression level mapping
    const jpegQuality: Record<string, number> = {
      low: 40,
      medium: 65,
      high: 85,
    };
    const imgQuality = jpegQuality[quality] ?? 65;

    // Attempt to re-compress embedded images
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      try {
        const { node } = page;
        // Access XObject resources on each page
        const resources = node.Resources();
        if (!resources) continue;
        const xObjects = resources.XObject();
        if (!xObjects) continue;

        // Iterate over image XObjects
        const keys = xObjects.keys();
        for (const key of keys) {
          const xObj = xObjects.lookup(key);
          if (!xObj) continue;

          // Check if it's an image (Subtype = Image)
          try {
            // @ts-expect-error – low-level PDF-lib access
            const subtype = xObj.get(pdfDoc.context.obj('Subtype'));
            if (!subtype) continue;

            // @ts-expect-error – low-level PDF-lib access
            const streamBytes: Uint8Array = xObj.contents;
            if (!streamBytes || streamBytes.length < 100) continue;

            // Re-compress with sharp
            const recompressed = await sharp(Buffer.from(streamBytes))
              .jpeg({ quality: imgQuality })
              .toBuffer()
              .catch(() => null);

            if (recompressed && recompressed.length < streamBytes.length) {
              // @ts-expect-error – low-level mutation
              xObj.contents = recompressed;
            }
          } catch {
            // Skip images that can't be re-processed
          }
        }
      } catch {
        // Skip pages that fail — be resilient
      }
    }

    // Save with object stream compression (best pdf-lib can do)
    const compressed = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false,
    });

    return new NextResponse(compressed, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="compressed.pdf"',
        'Content-Length': String(compressed.length),
      },
    });
  } catch (err) {
    console.error('[compress-pdf]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
