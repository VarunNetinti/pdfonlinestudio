'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function PdfToWordPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'docx' | 'txt'>('docx');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL] = useState('');

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg('');
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(15); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('format', format);
      setProgress(45);
      const res = await fetch('/api/pdf-to-word', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Conversion failed'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'document.docx');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=document.docx&tool=pdf-to-word`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const outName = file ? file.name.replace(/\.pdf$/i, `.${format}`) : `document.${format}`;

  return (
    <ToolPageLayout
      title="PDF to Word"
      description="Convert PDF to an editable .docx Word document. Text, headings and layout preserved. Free."
      iconColor="bg-sky-50 text-sky-700"
      toolPath="/pdf-to-word"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone
          accept=".pdf"
          multiple={false}
          label="Drop your PDF file here"
          subLabel="Upload the PDF you want to convert to Word"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="mt-4 space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={handleReset} className="text-ink-600 hover:text-ink-900 text-xs">Remove</button>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-800 mb-3">Output format</p>
            <div className="grid grid-cols-2 gap-3">
              {([['docx', 'Word Document (.docx)', 'Editable in Microsoft Word, Google Docs'], ['txt', 'Plain Text (.txt)', 'Simple text, no formatting']] as const).map(([key, label, desc]) => (
                <button key={key} onClick={() => setFormat(key)}
                  className={`py-3 px-4 rounded-xl border text-left transition-all ${
                    format === key ? 'border-amber-500 bg-amber-50' : 'border-ink-200 hover:border-ink-300'
                  }`}>
                  <p className={`text-sm font-semibold ${format === key ? 'text-amber-900' : 'text-ink-800'}`}>{label}</p>
                  <p className="text-xs text-ink-600 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 flex gap-2 text-xs text-amber-900">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Best results with text-based PDFs. Scanned PDFs (images of pages) may produce limited output without OCR.</span>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Converting to Word…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">PDF Converted!</h2>
          <p className="text-ink-700 text-sm mb-6">Your editable {format.toUpperCase()} file is ready.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download={outName} className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download {outName}
            </a>
            <button onClick={handleReset} className="btn-outline">Convert another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleConvert} className="btn-primary flex-1 justify-center py-3.5">
            Convert to {format === 'docx' ? 'Word' : 'Text'}
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to convert PDF to Word — free online</h2>
        <p>
          Upload your PDF to PdfOnlineStudio, choose .docx or .txt output, and click Convert. For text-based PDFs — documents created digitally in Word, InDesign, or similar tools — the conversion extracts text and structure into an editable Word document.
        </p>
        <h3>What's the difference between PDF to DOCX and PDF to TXT?</h3>
        <p>
          DOCX preserves document structure: headings, paragraphs, tables, and basic formatting are retained in the output Word file. TXT extracts raw text only, with no formatting — ideal for pasting into other tools or feeding into scripts.
        </p>
        <h3>What about scanned PDFs?</h3>
        <p>
          Scanned PDFs are images — they contain no machine-readable text, so conversion produces limited output without OCR (optical character recognition). For best results, use PDFs that were originally created digitally.
        </p>
        <h3>Related tools</h3>
        <p>
          Going the other way? Use <Link href="/word-to-pdf">Word to PDF</Link>. Or <Link href="/pdf-to-text">extract plain text</Link> from any PDF as a standalone .txt file.
        </p>
      </div>
    </ToolPageLayout>
  );
}
