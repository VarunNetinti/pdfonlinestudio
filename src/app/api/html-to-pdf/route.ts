import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n').replace(/<p[^>]*>/gi, '')
    .replace(/<\/h[1-6]>/gi, '\n\n').replace(/<h([1-6])[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n').replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '  • ')
    .replace(/<\/tr>/gi, '\n').replace(/<td[^>]*>/gi, '\t').replace(/<th[^>]*>/gi, '\t')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n))
    .replace(/\t+/g,' | ').replace(/[ \t]+$/gm,'').replace(/\n{3,}/g,'\n\n').trim();
}

function wrapLine(text: string, font: import('pdf-lib').PDFFont, size: number, maxW: number) {
  const words = text.split(' ').filter(Boolean);
  const lines: string[] = []; let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    try {
      if (font.widthOfTextAtSize(test,size)>maxW&&cur){lines.push(cur);cur=w;}else cur=test;
    } catch { cur=test; }
  }
  if (cur) lines.push(cur);
  return lines;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File|null;
    const htmlText = formData.get('html') as string|null;
    if (!file && !htmlText) return NextResponse.json({error:'No HTML content provided'},{status:400});

    const raw = file ? await file.text() : (htmlText??'');
    const text = stripHtml(raw);
    const lines = text.split(/\r?\n/);

    const PAGE_W=595.28, PAGE_H=841.89, MARGIN=52, FONT_SIZE=11;
    const pdfDoc = await PDFDocument.create();
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldF   = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const maxW    = PAGE_W - MARGIN*2;

    let page = pdfDoc.addPage([PAGE_W,PAGE_H]);
    let y = PAGE_H - MARGIN;

    // Title from file name or <title> tag
    const titleMatch = raw.match(/<title[^>]*>([^<]+)<\/title>/i);
    const docTitle = titleMatch ? titleMatch[1].trim() : (file?.name.replace(/\.html?$/i,'') ?? 'HTML Document');
    const titleSize = 16;
    for (const tl of wrapLine(docTitle, boldF, titleSize, maxW)) {
      if (y-titleSize < MARGIN) { page = pdfDoc.addPage([PAGE_W,PAGE_H]); y = PAGE_H-MARGIN; }
      try { page.drawText(tl,{x:MARGIN,y:y-titleSize,size:titleSize,font:boldF,color:rgb(0.08,0.08,0.12)}); } catch {}
      y -= titleSize*1.4;
    }
    page.drawLine({start:{x:MARGIN,y:y-4},end:{x:PAGE_W-MARGIN,y:y-4},thickness:1,color:rgb(0.85,0.6,0.1)});
    y -= 20;

    for (const rawLine of lines) {
      const wrapped = rawLine.length===0 ? [''] : wrapLine(rawLine,regular,FONT_SIZE,maxW);
      for (const wl of wrapped) {
        if (y-FONT_SIZE<MARGIN){page=pdfDoc.addPage([PAGE_W,PAGE_H]);y=PAGE_H-MARGIN;}
        if (wl.trim()) {
          try {
            page.drawText(wl.replace(/[^\x20-\x7E\xA0-\xFF]/g,''),
              {x:MARGIN,y:y-FONT_SIZE,size:FONT_SIZE,font:regular,color:rgb(0.07,0.07,0.07)});
          } catch {}
        }
        y -= FONT_SIZE*1.5;
      }
    }

    const result = await pdfDoc.save();
    const outName = file ? file.name.replace(/\.html?$/i,'.pdf') : 'converted.pdf';
    return new NextResponse(result,{status:200,headers:{
      'Content-Type':'application/pdf',
      'Content-Disposition':`attachment; filename="${outName}"`,
      'Content-Length':String(result.length),
    }});
  } catch (err) {
    console.error('[html-to-pdf]',err);
    return NextResponse.json({error:err instanceof Error?err.message:'Internal error'},{status:500});
  }
}
