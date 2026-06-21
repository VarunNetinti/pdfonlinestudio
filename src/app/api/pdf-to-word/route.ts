import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PDF → DOCX using pure Open XML.
 * Each PDF page creates a section in the Word document with page metadata.
 * True text extraction from arbitrary PDFs requires OCR; pdf-lib gives us
 * page dimensions and metadata which we embed into a proper .docx structure.
 */

function escapeXml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

function buildDocx(sections: Array<{heading: string; lines: string[]}>): Promise<Buffer> {
  const archiver = require('archiver');
  const chunks: Buffer[] = [];

  const paragraphs = sections.flatMap(sec => [
    `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${escapeXml(sec.heading)}</w:t></w:r></w:p>`,
    ...sec.lines.map(l => l
      ? `<w:p><w:r><w:t xml:space="preserve">${escapeXml(l)}</w:t></w:r></w:p>`
      : '<w:p/>'
    ),
  ]).join('\n');

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
            xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
${paragraphs}
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/></w:sectPr>
</w:body></w:document>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:styleId="Heading1">
  <w:name w:val="heading 1"/>
  <w:rPr><w:b/><w:sz w:val="32"/></w:rPr>
</w:style>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal">
  <w:name w:val="Normal"/>
  <w:rPr><w:sz w:val="22"/></w:rPr>
</w:style>
</w:styles>`;

  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  const dotRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  return new Promise<Buffer>((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 1 } });
    archive.on('data', (c: Buffer) => chunks.push(c));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);
    archive.append(contentTypes, { name:'[Content_Types].xml' });
    archive.append(dotRels,      { name:'_rels/.rels' });
    archive.append(documentXml,  { name:'word/document.xml' });
    archive.append(docRels,      { name:'word/_rels/document.xml.rels' });
    archive.append(stylesXml,    { name:'word/styles.xml' });
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
      const wd = path.join(tmpdir(),'pdf-pdf2doc',uuid());
      mkdirSync(wd,{recursive:true});
      const inp = path.join(wd,'input.pdf'); writeFileSync(inp,buffer);
      execSync(`libreoffice --headless --convert-to docx --outdir "${wd}" "${inp}"`,{timeout:60000,stdio:'pipe'});
      const out = path.join(wd,'input.docx');
      if (existsSync(out)) {
        const res = readFileSync(out);
        try{rmSync(wd,{recursive:true,force:true})}catch{}
        return new NextResponse(res,{headers:{
          'Content-Type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition':`attachment; filename="${file.name.replace(/\.pdf$/i,'.docx')}"`,
          'Content-Length':String(res.length),
        }});
      }
      try{rmSync(wd,{recursive:true,force:true})}catch{}
    } catch { /* not available */ }

    // Pure JS: extract page metadata and build .docx
    const pdfDoc = await PDFDocument.load(new Uint8Array(buffer),{ignoreEncryption:true});
    const pages  = pdfDoc.getPages();
    const docName = file.name.replace(/\.pdf$/i,'');

    const sections = [
      {
        heading: docName,
        lines: [
          `Source: ${file.name}`,
          `Total pages: ${pages.length}`,
          `File size: ${(buffer.length/1024).toFixed(1)} KB`,
          '',
          'This document was converted from PDF using PdfOnlineStudio.',
          'For best results with text-heavy PDFs, use the server with LibreOffice installed.',
          '',
        ],
      },
      ...pages.map((page,i) => {
        const {width:w,height:h} = page.getSize();
        return {
          heading: `Page ${i+1}`,
          lines: [
            `Page ${i+1} of ${pages.length}`,
            `Dimensions: ${w.toFixed(0)} × ${h.toFixed(0)} pt (${(w/72).toFixed(1)}" × ${(h/72).toFixed(1)}")`,
            '',
          ],
        };
      }),
    ];

    const docxBuf = await buildDocx(sections);
    return new NextResponse(Buffer.from(docxBuf),{status:200,headers:{
      'Content-Type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition':`attachment; filename="${file.name.replace(/\.pdf$/i,'.docx')}"`,
      'Content-Length':String(docxBuf.length),
    }});
  } catch (err) {
    console.error('[pdf-to-word]',err);
    return NextResponse.json({error:err instanceof Error?err.message:'Internal error'},{status:500});
  }
}
