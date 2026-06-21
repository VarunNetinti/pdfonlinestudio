'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

type SplitMode = 'all' | 'range';

export default function SplitPage() {
  const router = useRouter();
  const [file, setFile]         = useState<File | null>(null);
  const [mode, setMode]         = useState<SplitMode>('all');
  const [rangeInput, setRange]  = useState('');
  const [status, setStatus]     = useState<'idle'|'processing'|'success'|'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL]    = useState('');

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg('');
  };

  const handleSplit = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(15); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('mode', mode);
      if (mode === 'range') fd.append('range', rangeInput);
      setProgress(40);
      const res = await fetch('/api/split-pdf', { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Split failed'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'pages.zip');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=pages.zip&tool=split`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  return (
    <ToolPageLayout
      title="Split PDF"
      description="Extract individual pages or a custom range from any PDF file. Free and instant."
      iconColor="bg-purple-50 text-purple-700"
      toolPath="/split"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
      }
    >
      {/* Upload */}
      {!file && status !== 'success' && (
        <DropZone
          accept=".pdf"
          multiple={false}
          label="Drop your PDF file here"
          subLabel="Upload the PDF you want to split"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {/* File + options */}
      {file && status !== 'success' && (
        <div className="space-y-6">
          {/* File chip */}
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={handleReset} className="text-ink-700 hover:text-red-600 transition-colors p-1" aria-label="Remove file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Mode selector */}
          <fieldset>
            <legend className="text-sm font-semibold text-ink-800 mb-3">Split mode</legend>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'all',   label: 'Split all pages',   desc: 'Each page becomes a separate PDF' },
                { key: 'range', label: 'Custom page range', desc: 'e.g. 1-3, 5, 7-9' },
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setMode(opt.key as SplitMode)}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-150 ${mode === opt.key ? 'border-ink-800 bg-ink-50' : 'border-ink-100 hover:border-ink-300'}`}
                  aria-pressed={mode === opt.key}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${mode === opt.key ? 'border-ink-800' : 'border-ink-300'}`} aria-hidden="true">
                      {mode === opt.key && <div className="w-2 h-2 bg-ink-800 rounded-full" />}
                    </div>
                    <span className="text-sm font-semibold text-ink-900">{opt.label}</span>
                  </div>
                  <p className="text-xs text-ink-600 pl-6">{opt.desc}</p>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Range input */}
          {mode === 'range' && (
            <div>
              <label htmlFor="page-range" className="block text-sm font-semibold text-ink-800 mb-2">
                Page range
              </label>
              <input
                id="page-range"
                type="text"
                value={rangeInput}
                onChange={e => setRange(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-9"
                className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-ink-900 text-sm font-mono focus:outline-none focus:border-ink-500 transition-colors"
                aria-describedby="range-hint"
              />
              <p id="range-hint" className="text-xs text-ink-600 mt-1.5">Use commas to separate pages, hyphens for ranges.</p>
            </div>
          )}
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Splitting PDF…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">PDF Split!</h2>
          <p className="text-ink-700 text-sm mb-6">Your pages are ready. Download the ZIP archive below.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="split-pages.zip" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download ZIP
            </a>
            <button onClick={handleReset} className="btn-outline">Split another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6">
          <button
            onClick={handleSplit}
            disabled={mode === 'range' && !rangeInput.trim()}
            className="btn-primary w-full justify-center py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Split PDF
          </button>
        </div>
      )}

      {/* ── SEO content ── */}
      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to split a PDF online — free</h2>
        <p>
          Splitting a PDF with PdfOnlineStudio is simple: upload your file, choose between splitting all pages or a custom range, and download the result as a ZIP archive. Each page is extracted as an individual PDF file — no quality loss, no watermarks.
        </p>
        <h3>Split all pages vs. custom range</h3>
        <p>
          <strong>Split all pages</strong> extracts every page of your PDF into its own file. This is useful when you have a multi-page scan or report and need each page separately.
        </p>
        <p>
          <strong>Custom page range</strong> lets you specify exactly which pages to extract. Use a format like <code className="bg-ink-100 px-1.5 py-0.5 rounded text-xs font-mono text-ink-800">1-3, 5, 8-10</code> to extract pages 1, 2, 3, 5, 8, 9, and 10.
        </p>
        <h3>Common uses for splitting PDFs</h3>
        <ul>
          <li>Extracting a single chapter from a long e-book or report</li>
          <li>Separating individual invoices from a combined statement</li>
          <li>Isolating a specific page to share without revealing the full document</li>
          <li>Breaking a large PDF into smaller files for email attachments</li>
        </ul>
        <h3>Are my files safe?</h3>
        <p>
          All files are processed on PdfOnlineStudio servers in isolated environments and permanently deleted within 60 seconds of your download completing. We never retain or share your documents.
        </p>
      </div>
    </ToolPageLayout>
  );
}
