import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── Page layout constants (A4) ────────────────────────────────
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_X = 60;
const MARGIN_Y = 56;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const LINE_H_FACTOR = 1.45;

// ── Font sizes ────────────────────────────────────────────────
const SIZE = { h1: 22, h2: 17, h3: 14, body: 11, small: 9 };

interface Block {
  text: string;
  size: number;
  bold: boolean;
  indent: number;
  spaceBefore: number;
  spaceAfter: number;
  bullet: boolean;
  blank: boolean;
  center: boolean;
}

/** Unescape XML entities */
function unescapeXml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/** Replace smart quotes + common Unicode → Latin-1 equivalents */
function toSafe(s: string): string {
  return s
    .replace(/[\u2018\u2019\u0060\u00B4]/g, "'")
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
    .replace(/\u2013/g, '-')
    .replace(/\u2014/g, '--')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2022/g, '*')
    .replace(/\u2192/g, '->')
    .replace(/\u2190/g, '<-')
    .replace(/\u00B7/g, '·')
    // Strip anything outside printable ASCII + common Latin-1 (0x20-0xFF)
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
}

/** Wrap text to fit within maxWidth, returns array of lines */
function wrap(text: string, font: import('pdf-lib').PDFFont, size: number, maxW: number): string[] {
  if (!text.trim()) return [];
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    try {
      if (font.widthOfTextAtSize(test, size) > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    } catch {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

/** Parse a .docx buffer into Block[] using JSZip + regex */
async function parseDocx(buffer: Buffer): Promise<Block[]> {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);

  const docFile = zip.file('word/document.xml');
  if (!docFile) throw new Error('Not a valid .docx — missing word/document.xml');

  const xml = await docFile.async('string');
  const blocks: Block[] = [];

  // Match every <w:p> paragraph
  const paraRe = /<w:p[ >]([\s\S]*?)<\/w:p>/g;
  let pm: RegExpExecArray | null;

  while ((pm = paraRe.exec(xml)) !== null) {
    const para = pm[1];

    // ── Detect style ──────────────────────────────────────────
    const styleVal = (para.match(/<w:pStyle\s+w:val="([^"]+)"/) || [])[1]?.toLowerCase() ?? '';
    const isH1 = /^(heading1|title|h1)$/.test(styleVal);
    const isH2 = /^(heading2|h2)$/.test(styleVal);
    const isH3 = /^(heading[34]|h[34]|subtitle)$/.test(styleVal);
    const isCenter = /<w:jc\s+w:val="center"/.test(para);
    const isBulletStyle = /list|bullet/.test(styleVal) || /<w:numPr>/.test(para);

    // ── Detect indent (twips → points: 1pt = 20 twips) ───────
    const indentTwips = parseInt((para.match(/<w:ind\s+w:left="(\d+)"/) || ['', '0'])[1], 10);
    const indentPt = Math.min(indentTwips / 20, 80); // cap at 80pt

    // ── Collect all text runs ─────────────────────────────────
    // w:r elements contain w:t text nodes
    const runRe = /<w:r[ >]([\s\S]*?)<\/w:r>/g;
    let rm: RegExpExecArray | null;
    const runParts: Array<{ text: string; bold: boolean }> = [];

    while ((rm = runRe.exec(para)) !== null) {
      const run = rm[1];
      // Bold: <w:b/> or <w:b w:val="1"> present and NOT <w:b w:val="0">
      const hasBold = /<w:b(?!\s+w:val="0")/.test(run);

      // Get text: handle xml:space="preserve"
      const textRe = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
      let tm: RegExpExecArray | null;
      let runText = '';
      while ((tm = textRe.exec(run)) !== null) {
        runText += tm[1];
      }
      if (runText) {
        runParts.push({ text: unescapeXml(runText), bold: hasBold });
      }
    }

    // ── Also capture <w:hyperlink> text ──────────────────────
    const hyperlinkRe = /<w:hyperlink[^>]*>([\s\S]*?)<\/w:hyperlink>/g;
    let hl: RegExpExecArray | null;
    while ((hl = hyperlinkRe.exec(para)) !== null) {
      const hlContent = hl[1];
      const tlRe = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
      let tl: RegExpExecArray | null;
      while ((tl = tlRe.exec(hlContent)) !== null) {
        if (tl[1]) runParts.push({ text: unescapeXml(tl[1]), bold: false });
      }
    }

    const rawText = runParts.map(r => r.text).join('');
    const text = toSafe(rawText);
    const isBold = isH1 || isH2 || isH3 || runParts.some(r => r.bold);

    // ── Determine sizes / spacing ─────────────────────────────
    const size = isH1 ? SIZE.h1 : isH2 ? SIZE.h2 : isH3 ? SIZE.h3 : SIZE.body;
    const spaceBefore = isH1 ? 20 : isH2 ? 14 : isH3 ? 10 : 2;
    const spaceAfter  = isH1 ? 10 : isH2 ? 8  : isH3 ? 6  : 2;

    if (!text.trim()) {
      blocks.push({ text: '', size: SIZE.body, bold: false, indent: 0, spaceBefore: 6, spaceAfter: 0, bullet: false, blank: true, center: false });
    } else {
      blocks.push({
        text,
        size,
        bold: isBold,
        indent: isBulletStyle ? 16 : indentPt,
        spaceBefore,
        spaceAfter,
        bullet: isBulletStyle,
        blank: false,
        center: isCenter,
      });
    }
  }

  return blocks;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!['doc', 'docx', 'odt', 'rtf'].includes(ext)) {
      return NextResponse.json(
        { error: 'Unsupported format. Upload .docx, .doc, .odt, or .rtf' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ── Try LibreOffice (best quality, available on Linux prod servers) ──
    try {
      const { execSync } = await import('child_process');
      const { writeFileSync, readFileSync, mkdirSync, rmSync, existsSync } = await import('fs');
      const path = await import('path');
      const { tmpdir } = await import('os');
      const { v4: uuidv4 } = await import('uuid');

      const workDir = path.join(tmpdir(), 'pdftools-w2p', uuidv4());
      mkdirSync(workDir, { recursive: true });

      const inputPath = path.join(workDir, `input.${ext}`);
      writeFileSync(inputPath, buffer);

      execSync(
        `libreoffice --headless --convert-to pdf --outdir "${workDir}" "${inputPath}"`,
        { timeout: 60_000, stdio: 'pipe' }
      );

      const pdfPath = path.join(workDir, 'input.pdf');
      if (existsSync(pdfPath)) {
        const pdfBytes = readFileSync(pdfPath);
        try { rmSync(workDir, { recursive: true, force: true }); } catch {}

        const outName = file.name.replace(/\.(docx?|odt|rtf)$/i, '.pdf');
        return new NextResponse(pdfBytes, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${outName}"`,
            'Content-Length': String(pdfBytes.length),
          },
        });
      }
    } catch {
      // LibreOffice not installed → fall through to JS conversion
    }

    // ── Pure-JS .docx → PDF (no server deps required) ────────
    let blocks: Block[] = [];

    if (ext === 'docx') {
      try {
        blocks = await parseDocx(buffer);
      } catch (err) {
        console.warn('[word-to-pdf] DOCX parse failed:', err);
      }
    }

    // Fallback for non-docx or parse failure
    if (blocks.length === 0) {
      const note = ext !== 'docx'
        ? `The .${ext} format has limited support in the browser-based converter.\nFor best results, convert your file to .docx format first.`
        : 'Text extraction produced limited results for this document. Try saving as .docx for better output.';

      blocks = [
        { text: file.name.replace(/\.[^.]+$/, ''), size: SIZE.h1, bold: true, indent: 0, spaceBefore: 0, spaceAfter: 12, bullet: false, blank: false, center: false },
        { text: note, size: SIZE.body, bold: false, indent: 0, spaceBefore: 8, spaceAfter: 0, bullet: false, blank: false, center: false },
      ];
    }

    // ── Render blocks → PDF pages ─────────────────────────────
    const pdfDoc = await PDFDocument.create();
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN_Y;

    const newPage = () => {
      page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN_Y;
    };

    for (const block of blocks) {
      if (block.blank) {
        y -= block.spaceBefore;
        if (y < MARGIN_Y) newPage();
        continue;
      }

      y -= block.spaceBefore;
      if (y < MARGIN_Y) newPage();

      const font = block.bold ? bold : regular;
      const sz = block.size;
      const lineH = sz * LINE_H_FACTOR;
      const x = MARGIN_X + block.indent;
      const maxW = CONTENT_W - block.indent;

      let displayText = block.text;
      if (block.bullet) displayText = `\u2022  ${displayText}`;

      const lines = wrap(displayText, font, sz, maxW);

      for (const line of lines) {
        if (!line) continue;
        if (y - sz < MARGIN_Y) newPage();

        const lineX = block.center
          ? Math.max(MARGIN_X, (PAGE_W - font.widthOfTextAtSize(line, sz)) / 2)
          : x;

        try {
          page.drawText(line, {
            x: lineX,
            y: y - sz,
            size: sz,
            font,
            color: rgb(0.07, 0.07, 0.07),
          });
        } catch {
          // Skip unencodable characters
        }
        y -= lineH;
      }

      y -= block.spaceAfter;
      if (y < MARGIN_Y) newPage();
    }

    const pdfBytes = await pdfDoc.save();
    const outName = file.name.replace(/\.(docx?|odt|rtf)$/i, '.pdf');

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${outName}"`,
        'Content-Length': String(pdfBytes.length),
      },
    });
  } catch (err) {
    console.error('[word-to-pdf]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
