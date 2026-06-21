'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function PdfToTextPage() {
  const router = useRouter();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'txt' | 'md'>('txt');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL] = useState('');
  const [preview, setPreview] = useState('');

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg(''); setPreview('');
  };

  const handleExtract = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(15); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('format', format);
      setProgress(45);
      const res = await fetch('/api/pdf-to-text', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Extraction failed'); }
      const blob = await res.blob();
      const text = await blob.text();
      setPreview(text.slice(0, 500));
      const _cacheKey = cacheDownload(blob, `extracted.${format}`);
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=extracted.${format}&tool=pdf-to-text`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  return (
    <ToolPageLayout
      title="PDF to Text"
      description="Extract all text content from your PDF and download as a plain .txt or Markdown file. Free."
      iconColor="bg-violet-50 text-violet-700"
      toolPath="/pdf-to-text"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone
          accept=".pdf"
          multiple={false}
          label="Drop your PDF file here"
          subLabel="Upload the PDF to extract text from"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
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
              {([['txt', 'Plain Text (.txt)'], ['md', 'Markdown (.md)']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setFormat(key)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                    format === key ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-ink-200 text-ink-700 hover:border-ink-300'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Extracting text…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="py-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink-900">Text extracted!</p>
              <p className="text-sm text-ink-600">Preview (first 500 chars):</p>
            </div>
          </div>
          {preview && (
            <div className="bg-ink-50 rounded-xl p-4 text-xs font-mono text-ink-700 mb-5 max-h-32 overflow-auto border border-ink-100">
              {preview}…
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download={`extracted.${format}`} className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download .{format} file
            </a>
            <button onClick={handleReset} className="btn-outline">Extract another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleExtract} className="btn-primary flex-1 justify-center py-3.5">
            Extract Text
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to extract text from a PDF — free online</h2>
        <p>
          Use PdfOnlineStudio to extract all readable text from any PDF document. Upload your file, choose plain text or Markdown output, and click Extract. The text is ready in seconds, formatted for easy copy-paste or further editing.
        </p>
        <h3>What kind of PDFs work best?</h3>
        <p>
          Text extraction works best on "digital" PDFs — documents that were originally created in Word, InDesign, or exported from software. Scanned PDFs (images of pages) don't contain machine-readable text, so extraction won't produce readable output. For scanned documents, OCR software is needed.
        </p>
        <h3>Why extract text from a PDF?</h3>
        <p>
          Common use cases include: feeding PDF content into AI or NLP tools, migrating content from old PDF reports into new documents, repurposing contract text, creating searchable notes from scanned lecture slides, or archiving document content in a lightweight text format.
        </p>
        <h3>Related tools</h3>
        <p>
          You might also want to <Link href="/pdf-to-jpg">convert PDF pages to images</Link> or <Link href="/split">split out specific pages</Link> before extracting.
        </p>
      </div>
    </ToolPageLayout>
  );
}
