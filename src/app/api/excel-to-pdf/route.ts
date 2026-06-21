import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_W = 841.89, PAGE_H = 595.28, MARGIN = 36; // A4 landscape for tables

function unescape(s: string) {
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
          .replace(/&quot;/g,'"').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n));
}
function safe(s: string) {
  return unescape(s).replace(/[^\x20-\x7E\xA0-\xFF]/g,'');
}

interface SheetData { name: string; rows: string[][]; }

async function parseXlsx(buffer: Buffer): Promise<SheetData[]> {
  const JSZip = (await import('jszip')).default;
  const zip   = await JSZip.loadAsync(buffer);

  // Shared strings (string pool)
  const ssFile = zip.file('xl/sharedStrings.xml');
  const sharedStrings: string[] = [];
  if (ssFile) {
    const ssXml = await ssFile.async('string');
    for (const m of ssXml.matchAll(/<si>[\s\S]*?<\/si>/g)) {
      const text = m[0].match(/<t(?:\s[^>]*)?>([^<]*)<\/t>/g)
        ?.map(t=>t.replace(/<[^>]+>/g,''))
        .join('')??'';
      sharedStrings.push(safe(text));
    }
  }

  // Workbook sheet list
  const wbFile  = zip.file('xl/workbook.xml');
  const wbXml   = wbFile ? await wbFile.async('string') : '';
  const wbRelsF = zip.file('xl/_rels/workbook.xml.rels');
  const wbRels  = wbRelsF ? await wbRelsF.async('string') : '';
  const relMap: Record<string,string> = {};
  for (const m of wbRels.matchAll(/Id="([^"]+)"[^>]+Target="([^"]+)"/g)) relMap[m[1]]=m[2];

  const sheets: SheetData[] = [];
  for (const m of wbXml.matchAll(/<sheet\s[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g)) {
    const name   = safe(m[1]);
    const target = relMap[m[2]];
    if (!target) continue;
    const sheetPath = target.startsWith('xl/') ? target : `xl/${target}`;
    const shFile = zip.file(sheetPath);
    if (!shFile) continue;
    const shXml  = await shFile.async('string');

    const rows: string[][] = [];
    for (const rowM of shXml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const row: string[] = [];
      for (const cellM of rowM[1].matchAll(/<c\s([^>]*)>([\s\S]*?)<\/c>/g)) {
        const attrs = cellM[1];
        const inner = cellM[2];
        const t = (attrs.match(/t="([^"]+)"/) || [])[1];
        const vM = inner.match(/<v>([^<]*)<\/v>/);
        const val = vM ? vM[1] : '';
        if (t === 's') {
          row.push(sharedStrings[parseInt(val)] ?? '');
        } else if (t === 'inlineStr') {
          const is = inner.match(/<t>([^<]*)<\/t>/);
          row.push(safe(is?.[1]??''));
        } else {
          row.push(safe(val));
        }
      }
      if (row.some(c=>c.trim())) rows.push(row);
    }
    if (rows.length) sheets.push({ name, rows });
  }
  return sheets.length ? sheets : [{ name:'Sheet1', rows:[['(No data found in this spreadsheet)']] }];
}

async function parseCsv(text: string): Promise<SheetData[]> {
  const rows = text.split(/\r?\n/).filter(l=>l.trim()).map(l=>
    l.split(',').map(c=>safe(c.replace(/^"|"$/g,'').replace(/""/g,'"')))
  );
  return [{ name:'CSV', rows }];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File|null;
    if (!file) return NextResponse.json({error:'No file provided'},{status:400});
    const ext = file.name.split('.').pop()?.toLowerCase()??'';
    if (!['xlsx','xls','csv','ods'].includes(ext))
      return NextResponse.json({error:'Upload a .xlsx, .xls, .csv, or .ods file'},{status:400});

    const buffer = Buffer.from(await file.arrayBuffer());

    // Try LibreOffice (Linux prod)
    try {
      const { execSync } = await import('child_process');
      const { writeFileSync,readFileSync,mkdirSync,existsSync,rmSync } = await import('fs');
      const path = await import('path'); const { tmpdir } = await import('os');
      const { v4: uuid } = await import('uuid');
      const wd = path.join(tmpdir(),'pdf-xl2pdf',uuid());
      mkdirSync(wd,{recursive:true});
      const inp = path.join(wd,`input.${ext}`); writeFileSync(inp,buffer);
      execSync(`libreoffice --headless --convert-to pdf --outdir "${wd}" "${inp}"`,{timeout:60000,stdio:'pipe'});
      const out = path.join(wd,'input.pdf');
      if (existsSync(out)) {
        const res = readFileSync(out);
        try{rmSync(wd,{recursive:true,force:true})}catch{}
        return new NextResponse(res,{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${file.name.replace(/\.[^.]+$/,'.pdf')}"`,'Content-Length':String(res.length)}});
      }
      try{rmSync(wd,{recursive:true,force:true})}catch{}
    } catch { /* not available */ }

    // Pure JS: parse spreadsheet and render as table PDF
    let sheets: SheetData[];
    if (ext === 'csv') {
      sheets = await parseCsv(await file.text());
    } else {
      sheets = await parseXlsx(buffer);
    }

    const pdfDoc  = await PDFDocument.create();
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldF   = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (const sheet of sheets) {
      if (!sheet.rows.length) continue;

      // Calculate column widths (max 120pt each, min 40pt)
      const colCount = Math.max(...sheet.rows.map(r=>r.length));
      const colWidths = Array.from({length:colCount},(_,ci)=>{
        const maxLen = Math.max(...sheet.rows.map(r=>(r[ci]??'').length));
        return Math.min(Math.max(maxLen*6.5+12, 40), 150);
      });
      const tableW = Math.min(colWidths.reduce((a,b)=>a+b,0), PAGE_W-MARGIN*2);
      const scale  = tableW<(PAGE_W-MARGIN*2) ? 1 : (PAGE_W-MARGIN*2)/tableW;
      const scaledWidths = colWidths.map(w=>w*scale);

      const ROW_H = 18, HEADER_H = 22, FONT_SIZE = 9;

      let page = pdfDoc.addPage([PAGE_W,PAGE_H]);
      let y    = PAGE_H - MARGIN;

      // Sheet name header
      try { page.drawText(`Sheet: ${sheet.name}`,{x:MARGIN,y:y-14,size:13,font:boldF,color:rgb(0.1,0.1,0.15)}); } catch {}
      y -= 28;

      for (let ri=0;ri<sheet.rows.length;ri++) {
        const row = sheet.rows[ri];
        const isHeader = ri===0;
        const rowH = isHeader ? HEADER_H : ROW_H;

        // New page if needed
        if (y-rowH<MARGIN) {
          page = pdfDoc.addPage([PAGE_W,PAGE_H]);
          y = PAGE_H - MARGIN;
        }

        // Row background
        const bgColor = isHeader ? rgb(0.15,0.15,0.2) : ri%2===0 ? rgb(0.97,0.97,0.97) : rgb(1,1,1);
        page.drawRectangle({x:MARGIN,y:y-rowH,width:tableW*scale,height:rowH,color:bgColor});

        // Cells
        let x = MARGIN;
        for (let ci=0;ci<colCount;ci++) {
          const cell  = safe(row[ci]??'');
          const cw    = scaledWidths[ci];
          const font  = isHeader ? boldF : regular;
          const color = isHeader ? rgb(1,1,1) : rgb(0.1,0.1,0.15);
          // Truncate if too wide
          let text = cell;
          try {
            while (text.length>0 && font.widthOfTextAtSize(text,FONT_SIZE)>cw-6) text=text.slice(0,-1);
            if (text!==cell) text=text.slice(0,-1)+'…';
            page.drawText(text,{x:x+4,y:y-rowH+5,size:FONT_SIZE,font,color});
          } catch {}
          // Cell border
          page.drawRectangle({x,y:y-rowH,width:cw,height:rowH,borderColor:rgb(0.78,0.78,0.78),borderWidth:0.4,color:rgb(0,0,0,0)});
          x += cw;
        }
        y -= rowH;
      }
    }

    const bytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(bytes),{status:200,headers:{
      'Content-Type':'application/pdf',
      'Content-Disposition':`attachment; filename="${file.name.replace(/\.[^.]+$/,'.pdf')}"`,
      'Content-Length':String(bytes.length),
    }});
  } catch (err) {
    console.error('[excel-to-pdf]',err);
    return NextResponse.json({error:err instanceof Error?err.message:'Internal error'},{status:500});
  }
}
