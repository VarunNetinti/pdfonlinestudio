'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

type Quality = 'low' | 'medium' | 'high';

const qualityOptions: { key: Quality; label: string; desc: string; tag: string; tagColor: string }[] = [
  { key: 'low',    label: 'Maximum compression', desc: 'Smallest file, some quality reduction',  tag: '~70% smaller', tagColor: 'bg-green-100 text-green-800' },
  { key: 'medium', label: 'Balanced',             desc: 'Good compression, acceptable quality',   tag: '~50% smaller', tagColor: 'bg-blue-100 text-blue-800' },
  { key: 'high',   label: 'Best quality',          desc: 'Minimal compression, high fidelity',    tag: '~20% smaller', tagColor: 'bg-purple-100 text-purple-800' },
];

function fmt(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export default function CompressPage() {
  const router = useRouter();
  const [file, setFile]         = useState<File | null>(null);
  const [quality, setQuality]   = useState<Quality>('medium');
  const [status, setStatus]     = useState<'idle'|'processing'|'success'|'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL]    = useState('');
  const [resultSize, setResultSize] = useState(0);

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg(''); setResultSize(0);
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(10); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('quality', quality);
      setProgress(35);
      const res = await fetch('/api/compress-pdf', { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Compression failed'); }
      const blob = await res.blob();
      const savings = file ? Math.max(0, Math.round((1 - blob.size / file.size) * 100)) : 0;
      const outName = file?.name.replace(/\.pdf$/i, '-compressed.pdf') || 'compressed.pdf';
      const _cacheKey = cacheDownload(blob, outName);
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=${encodeURIComponent(outName)}&tool=compress&saved=${savings}`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const savings = file && resultSize ? Math.max(0, Math.round((1 - resultSize / file.size) * 100)) : 0;

  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Reduce your PDF file size by up to 70% with three compression levels. Free, no watermarks."
      iconColor="bg-green-50 text-green-700"
      toolPath="/compress"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
          <line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone
          accept=".pdf" multiple={false}
          label="Drop your PDF file here"
          subLabel="Upload the PDF you want to compress"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600 font-mono">{fmt(file.size)}</p>
            </div>
            <button onClick={handleReset} className="text-ink-700 hover:text-red-600 p-1 transition-colors" aria-label="Remove file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-ink-800 mb-3">Compression level</legend>
            <div className="space-y-2">
              {qualityOptions.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setQuality(opt.key)}
                  aria-pressed={quality === opt.key}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${quality === opt.key ? 'border-ink-800 bg-ink-50' : 'border-ink-100 hover:border-ink-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${quality === opt.key ? 'border-ink-800' : 'border-ink-300'}`} aria-hidden="true">
                      {quality === opt.key && <div className="w-2 h-2 bg-ink-800 rounded-full" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{opt.label}</p>
                      <p className="text-xs text-ink-600">{opt.desc}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded-lg ${opt.tagColor}`}>{opt.tag}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Compressing PDF…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-2">PDF Compressed!</h2>
          {savings > 0 && (
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-5 border border-green-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/></svg>
              {savings}% smaller — {file && fmt(file.size)} → {fmt(resultSize)}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
            <a href={downloadUrl} download="compressed.pdf" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download compressed.pdf
            </a>
            <button onClick={handleReset} className="btn-outline">Compress another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6">
          <button onClick={handleCompress} className="btn-primary w-full justify-center py-3.5">
            Compress PDF
          </button>
        </div>
      )}

      {/* ── SEO content ── */}
      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to compress a PDF online — free</h2>
        <p>
          Large PDF files are difficult to send by email, upload to portals, or share via messaging apps. The PdfOnlineStudio PDF compressor reduces file size using three compression levels — choose the one that balances size and quality for your use case.
        </p>
        <h3>Which compression level should I choose?</h3>
        <p>
          <strong>Maximum compression</strong> produces the smallest file (up to 70% reduction) and is ideal for web uploads, email attachments, and archiving documents where pixel-perfect quality is not required.
        </p>
        <p>
          <strong>Balanced</strong> is the recommended setting for most users. It reduces file size by around 50% while keeping text sharp and images readable.
        </p>
        <p>
          <strong>Best quality</strong> applies minimal compression (around 20% reduction) and is ideal when you need to preserve high-fidelity images such as photography, technical diagrams, or print-ready documents.
        </p>
        <h3>Why is my PDF so large?</h3>
        <p>
          PDFs become large when they contain high-resolution embedded images, uncompressed fonts, or metadata from editing software. Scanned documents are especially large because each page is stored as a full-size image. Compression recodes these images at a lower resolution while keeping text layers intact.
        </p>
        <h3>Does compressing a PDF reduce quality?</h3>
        <p>
          For text-only PDFs, compression has almost no visible effect on quality. For image-heavy PDFs, the "Balanced" and "Maximum" settings will reduce image resolution slightly. Use "Best quality" if this matters for your document.
        </p>
      </div>
    </ToolPageLayout>
  );
}
