import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PDF → PPTX using pure Open XML.
 * Each PDF page becomes one slide with its dimensions and page number.
 * pdf-lib cannot extract text content from arbitrary PDFs (that requires OCR),
 * so each slide shows the page number and document metadata as a placeholder.
 * Users who need full content extraction should use LibreOffice on the server.
 */
function escapeXml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

function emuW(pt: number) { return Math.round(pt * 9144); } // points to EMU
function emuH(pt: number) { return Math.round(pt * 9144); }

function buildPptx(slides: Array<{ w:number; h:number; title:string; body:string }>, docName: string): Promise<Buffer> {
  const archiver = require('archiver');
  const chunks: Buffer[] = [];

  // slide dimensions (use first slide dims, fall back to 16:9)
  const SW = slides[0]?.w ?? 960;
  const SH = slides[0]?.h ?? 540;
  const cxEmu = emuW(SW);
  const cyEmu = emuH(SH);

  const slideXmls = slides.map((slide, i) => {
    const titleXml = `<p:sp>
      <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>
      <p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
      <p:spPr/>
      <p:txBody><a:bodyPr/><a:lstStyle/>
      <a:p><a:r><a:t>${escapeXml(slide.title)}</a:t></a:r></a:p>
      </p:txBody></p:sp>`;
    const bodyXml = `<p:sp>
      <p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>
      <p:nvPr><p:ph idx="1"/></p:nvPr></p:nvSpPr>
      <p:spPr/>
      <p:txBody><a:bodyPr/><a:lstStyle/>
      ${slide.body.split('\n').filter(Boolean).map(line=>`<a:p><a:r><a:t>${escapeXml(line)}</a:t></a:r></a:p>`).join('')}
      </p:txBody></p:sp>`;
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
       xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<p:cSld><p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
${titleXml}${bodyXml}
</p:spTree></p:cSld></p:sld>`;
  });

  const slideRelsXml = slides.map((_,i) =>
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`
  );

  const presXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
                xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
<p:sldIdLst>
${slides.map((_,i)=>`<p:sldId id="${256+i}" r:id="rId${i+2}"/>`).join('\n')}
</p:sldIdLst>
<p:sldSz cx="${cxEmu}" cy="${cyEmu}" type="custom"/>
<p:notesSz cx="${emuW(612)}" cy="${emuH(792)}"/>
</p:presentation>`;

  const presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
${slides.map((_,i)=>`<Relationship Id="rId${i+2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i+1}.xml"/>`).join('\n')}
</Relationships>`;

  // Minimal slide master
  const masterXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
             xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
</p:spTree></p:cSld>
<p:txStyles><p:titleStyle><a:lvl1pPr><a:defRPr lang="en-US"/></a:lvl1pPr></p:titleStyle>
<p:bodyStyle><a:lvl1pPr><a:defRPr lang="en-US"/></a:lvl1pPr></p:bodyStyle>
<p:otherStyle><a:lvl1pPr><a:defRPr lang="en-US"/></a:lvl1pPr></p:otherStyle>
</p:txStyles></p:sldMaster>`;

  const masterRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`;

  const layoutXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
             xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" type="blank">
<p:cSld name="Blank"><p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
</p:spTree></p:cSld></p:sldLayout>`;

  const layoutRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
${slides.map((_,i)=>`<Override PartName="/ppt/slides/slide${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('\n')}
</Types>`;

  const dotRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;

  return new Promise<Buffer>((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 1 } });
    archive.on('data', (c: Buffer) => chunks.push(c));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);

    archive.append(contentTypes,  { name:'[Content_Types].xml' });
    archive.append(dotRels,       { name:'_rels/.rels' });
    archive.append(presXml,       { name:'ppt/presentation.xml' });
    archive.append(presRels,      { name:'ppt/_rels/presentation.xml.rels' });
    archive.append(masterXml,     { name:'ppt/slideMasters/slideMaster1.xml' });
    archive.append(masterRels,    { name:'ppt/slideMasters/_rels/slideMaster1.xml.rels' });
    archive.append(layoutXml,     { name:'ppt/slideLayouts/slideLayout1.xml' });
    archive.append(layoutRels,    { name:'ppt/slideLayouts/_rels/slideLayout1.xml.rels' });
    slideXmls.forEach((xml,i) => {
      archive.append(xml,          { name:`ppt/slides/slide${i+1}.xml` });
      archive.append(slideRelsXml[i], { name:`ppt/slides/_rels/slide${i+1}.xml.rels` });
    });
    archive.finalize();
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File|null;
    if (!file) return NextResponse.json({error:'No file provided'},{status:400});
    if (!file.name.toLowerCase().endsWith('.pdf'))
      return NextResponse.json({error:'Upload a PDF file'},{status:400});

    const buffer = Buffer.from(await file.arrayBuffer());

    // Try LibreOffice (Linux prod)
    try {
      const { execSync } = await import('child_process');
      const { writeFileSync,readFileSync,mkdirSync,existsSync,rmSync } = await import('fs');
      const path = await import('path'); const { tmpdir } = await import('os');
      const { v4: uuid } = await import('uuid');
      const wd = path.join(tmpdir(),'pdf-pdf2ppt',uuid());
      mkdirSync(wd,{recursive:true});
      const inp = path.join(wd,'input.pdf'); writeFileSync(inp,buffer);
      execSync(`libreoffice --headless --convert-to pptx --outdir "${wd}" "${inp}"`,{timeout:60000,stdio:'pipe'});
      const out = path.join(wd,'input.pptx');
      if (existsSync(out)) {
        const res = readFileSync(out);
        try{rmSync(wd,{recursive:true,force:true})}catch{}
        return new NextResponse(res,{headers:{
          'Content-Type':'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition':`attachment; filename="${file.name.replace(/\.pdf$/i,'.pptx')}"`,
          'Content-Length':String(res.length),
        }});
      }
      try{rmSync(wd,{recursive:true,force:true})}catch{}
    } catch { /* not available */ }

    // Pure JS: one slide per PDF page
    const pdfDoc = await PDFDocument.load(new Uint8Array(buffer),{ignoreEncryption:true});
    const pages  = pdfDoc.getPages();
    const docName = file.name.replace(/\.pdf$/i,'');

    const slides = pages.map((page,i) => {
      const {width:w, height:h} = page.getSize();
      return {
        w, h,
        title: `${docName} — Page ${i+1}`,
        body: [
          `Source document: ${file.name}`,
          `Page ${i+1} of ${pages.length}`,
          `Page size: ${w.toFixed(0)} × ${h.toFixed(0)} pt`,
          '',
          'Note: Text content from PDF pages requires server-side',
          'LibreOffice for full fidelity conversion. This slide',
          'contains metadata for page ' + (i+1) + '.',
        ].join('\n'),
      };
    });

    const pptxBuf = await buildPptx(slides, docName);
    return new NextResponse(pptxBuf,{status:200,headers:{
      'Content-Type':'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition':`attachment; filename="${file.name.replace(/\.pdf$/i,'.pptx')}"`,
      'Content-Length':String(pptxBuf.length),
    }});
  } catch (err) {
    console.error('[pdf-to-ppt]',err);
    return NextResponse.json({error:err instanceof Error?err.message:'Internal error'},{status:500});
  }
}
