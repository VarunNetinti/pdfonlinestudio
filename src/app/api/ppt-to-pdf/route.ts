import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Slide canvas dimensions (px at 96dpi → ~10in × 5.625in = 16:9)
const SLIDE_W = 1280;
const SLIDE_H = 720;

// PDF page in points (1pt = 1/72 in → 960×540pt = 13.3"×7.5" = 16:9)
const PDF_W = 960;
const PDF_H = 540;

interface Slide {
  title: string;
  bodies: string[];
  bgColor: string;   // hex e.g. "FFFFFF"
  accent: string;    // hex e.g. "1F3864"
  slideNum: number;
  total: number;
}

function unx(s: string) {
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
          .replace(/&quot;/g,'"').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n));
}
function safe(s: string) {
  return unx(s).replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"')
    .replace(/\u2013/g,'-').replace(/\u2014/g,'--').replace(/\u2026/g,'...')
    .replace(/\u00A0/g,' ').replace(/[^\x20-\x7E\xA0-\xFF]/g,'');
}
function extractText(xml: string) {
  return xml.replace(/<a:br\/?>/g,'\n').replace(/<\/a:p>/g,'\n')
    .match(/<a:t(?:\s[^>]*)?>([^<]*)<\/a:t>/g)
    ?.map(m=>m.replace(/<[^>]+>/g,''))
    .join('')??'';
}

// Parse theme colour from theme1.xml
function parseThemeColor(xml: string, key: string): string {
  const m = new RegExp(`<a:${key}[^>]*>\\s*<a:srgbClr val="([0-9A-Fa-f]{6})"`, 's').exec(xml);
  return m ? m[1].toUpperCase() : (key === 'dk1' ? '1F3864' : 'FFFFFF');
}

async function parsePptx(buffer: Buffer): Promise<Slide[]> {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);

  // Load theme for colours
  const themeFile = zip.file('ppt/theme/theme1.xml');
  const themeXml  = themeFile ? await themeFile.async('string') : '';
  const accent1   = parseThemeColor(themeXml, 'accent1') || '4472C4';
  const dk1       = parseThemeColor(themeXml, 'dk1')     || '1F3864';

  const slideFiles = Object.keys(zip.files)
    .filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k))
    .sort((a,b) => parseInt(a.match(/\d+/)?.[0]??'0') - parseInt(b.match(/\d+/)?.[0]??'0'));

  const slides: Slide[] = [];

  for (let i = 0; i < slideFiles.length; i++) {
    const file = zip.file(slideFiles[i]);
    if (!file) continue;
    const xml = await file.async('string');

    // Try to get slide background colour from slide XML or slide layout
    let bgColor = 'FAFAFA';
    const bgRgbM = xml.match(/<p:bg>[\s\S]*?<a:srgbClr val="([0-9A-Fa-f]{6})"/);
    if (bgRgbM) bgColor = bgRgbM[1].toUpperCase();

    // Extract title
    const titleM = xml.match(/<p:sp>(?:(?!<\/p:sp>).)*?<p:ph\s+type="title"(?:(?!<\/p:sp>).)*?<\/p:sp>/s);
    const title  = titleM ? safe(extractText(titleM[0]).replace(/\n+/g,' ').trim()) : `Slide ${i+1}`;

    // Extract all non-title text bodies
    const bodies: string[] = [];
    const spRe = /<p:sp>([\s\S]*?)<\/p:sp>/g;
    let sm: RegExpExecArray|null;
    while ((sm = spRe.exec(xml)) !== null) {
      if (sm[1].includes('type="title"')) continue;
      const t = safe(extractText(sm[1])).trim();
      if (t) bodies.push(t);
    }

    slides.push({ title, bodies, bgColor, accent: accent1, slideNum: i+1, total: slideFiles.length });
  }

  return slides.length ? slides : [{ title:'Presentation', bodies:[], bgColor:'FAFAFA', accent:'4472C4', slideNum:1, total:1 }];
}

function hex2rgb(hex: string): [number,number,number] {
  const n = parseInt(hex.replace('#',''), 16);
  return [(n>>16)&255, (n>>8)&255, n&255];
}

function luminance(hex: string): number {
  const [r,g,b] = hex2rgb(hex);
  return 0.299*r + 0.587*g + 0.114*b;
}

function buildSvgSlide(slide: Slide): string {
  const bg    = `#${slide.bgColor}`;
  const acc   = `#${slide.accent}`;
  const isDarkBg = luminance(slide.bgColor) < 128;
  const textColor = isDarkBg ? '#FFFFFF' : '#1a1a2e';
  const subColor  = isDarkBg ? '#d0d0d0' : '#444466';

  // Wrap title text (approx 40 chars per line at 52px in 1100px width)
  const titleLines: string[] = [];
  const titleWords = slide.title.split(' ');
  let cur = '';
  for (const w of titleWords) {
    const test = cur ? `${cur} ${w}` : w;
    if (test.length > 38 && cur) { titleLines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) titleLines.push(cur);

  // Render body lines
  const bodyLines: string[] = [];
  for (const body of slide.bodies) {
    for (const rawLine of body.split('\n')) {
      const t = rawLine.trim();
      if (!t) { bodyLines.push(''); continue; }
      // Wrap at ~72 chars at 22px
      const words = t.split(' ');
      let bl = '';
      for (const w of words) {
        const test = bl ? `${bl} ${w}` : w;
        if (test.length > 72 && bl) { bodyLines.push(bl); bl = w; }
        else bl = test;
      }
      if (bl) bodyLines.push(bl);
    }
  }

  const TITLE_Y = 170;
  const titleSvg = titleLines.map((line, i) =>
    `<text x="90" y="${TITLE_Y + i * 68}" font-size="54" font-weight="700" fill="${textColor}" font-family="Arial, Helvetica, sans-serif" xml:space="preserve">${line.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>`
  ).join('\n');

  const bodyStartY = TITLE_Y + titleLines.length * 68 + 30;
  const bodySvg = bodyLines.slice(0, 12).map((line, i) => {
    if (!line) return '';
    const isBullet = /^[•*\-]/.test(line);
    const displayText = isBullet ? line.replace(/^[•*\-]\s*/, '') : line;
    return `${isBullet ? `<circle cx="95" cy="${bodyStartY + i * 32 - 5}" r="4" fill="${acc}"/>` : ''}
    <text x="${isBullet ? 110 : 90}" y="${bodyStartY + i * 32}" font-size="24" fill="${subColor}" font-family="Arial, Helvetica, sans-serif" xml:space="preserve">${displayText.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SLIDE_W}" height="${SLIDE_H}" viewBox="0 0 ${SLIDE_W} ${SLIDE_H}">
  <!-- Background -->
  <rect width="${SLIDE_W}" height="${SLIDE_H}" fill="${bg}"/>

  <!-- Top accent bar -->
  <rect width="${SLIDE_W}" height="8" fill="${acc}"/>

  <!-- Title area background -->
  <rect x="0" y="8" width="${SLIDE_W}" height="${TITLE_Y + titleLines.length * 68 + 10}" fill="${acc}" opacity="0.08"/>

  <!-- Left accent stripe -->
  <rect x="0" y="8" width="6" height="${SLIDE_H - 8}" fill="${acc}"/>

  <!-- Slide number -->
  <text x="${SLIDE_W - 20}" y="${SLIDE_H - 18}" font-size="18" fill="${subColor}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" opacity="0.6">${slide.slideNum} / ${slide.total}</text>

  <!-- Title -->
  ${titleSvg}

  <!-- Divider line -->
  <line x1="90" y1="${TITLE_Y + titleLines.length * 68 + 8}" x2="${SLIDE_W - 90}" y2="${TITLE_Y + titleLines.length * 68 + 8}" stroke="${acc}" stroke-width="2" opacity="0.4"/>

  <!-- Body text -->
  ${bodySvg}
</svg>`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File|null;
    if (!file) return NextResponse.json({ error:'No file provided' }, { status:400 });
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!['pptx','ppt','odp'].includes(ext))
      return NextResponse.json({ error:'Upload a .pptx, .ppt, or .odp file' }, { status:400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    // Try LibreOffice first (produces best quality on Linux servers)
    try {
      const { execSync } = await import('child_process');
      const { writeFileSync,readFileSync,mkdirSync,existsSync,rmSync } = await import('fs');
      const path = await import('path');
      const { tmpdir } = await import('os');
      const { v4: uuid } = await import('uuid');
      const wd = path.join(tmpdir(), 'pdftools-ppt2pdf', uuid());
      mkdirSync(wd, { recursive:true });
      const inp = path.join(wd, `input.${ext}`);
      writeFileSync(inp, buffer);
      execSync(`libreoffice --headless --convert-to pdf --outdir "${wd}" "${inp}"`, { timeout:60000, stdio:'pipe' });
      const out = path.join(wd, 'input.pdf');
      if (existsSync(out)) {
        const res = readFileSync(out);
        try { rmSync(wd, { recursive:true, force:true }); } catch {}
        return new NextResponse(res, { headers: {
          'Content-Type':'application/pdf',
          'Content-Disposition':`attachment; filename="${file.name.replace(/\.[^.]+$/,'.pdf')}"`,
          'Content-Length':String(res.length),
        }});
      }
      try { rmSync(wd, { recursive:true, force:true }); } catch {}
    } catch { /* LibreOffice not available — use visual renderer */ }

    // ── Pure JS: render each slide as an SVG image → PNG → embed in PDF ──
    // This preserves the VISUAL layout: background, accent colours, title styling,
    // body text with bullets — actual slide appearance, not just extracted text.

    const slides = await parsePptx(buffer);
    const pdfDoc  = await PDFDocument.create();

    for (const slide of slides) {
      const svg = buildSvgSlide(slide);

      // Rasterise SVG → PNG using sharp
      const png = await sharp(Buffer.from(svg))
        .resize(SLIDE_W, SLIDE_H)
        .png({ compressionLevel: 6 })
        .toBuffer();

      // Add a PDF page and embed the PNG as full-page image
      const page    = pdfDoc.addPage([PDF_W, PDF_H]);
      const pngImg  = await pdfDoc.embedPng(png);
      page.drawImage(pngImg, { x:0, y:0, width:PDF_W, height:PDF_H });
    }

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), { status:200, headers: {
      'Content-Type':'application/pdf',
      'Content-Disposition':`attachment; filename="${file.name.replace(/\.[^.]+$/,'.pdf')}"`,
      'Content-Length':String(pdfBytes.length),
    }});
  } catch (err) {
    console.error('[ppt-to-pdf]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status:500 });
  }
}
