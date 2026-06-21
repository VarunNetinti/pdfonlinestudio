'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { retrieveDownload, releaseDownload } from '@/lib/downloadCache';

const toolLinks = [
  { href: '/merge',       label: 'Merge PDF',    color: 'bg-blue-50   text-blue-700'   },
  { href: '/split',       label: 'Split PDF',    color: 'bg-purple-50 text-purple-700' },
  { href: '/compress',    label: 'Compress PDF', color: 'bg-green-50  text-green-700'  },
  { href: '/rotate',      label: 'Rotate PDF',   color: 'bg-orange-50 text-orange-700' },
  { href: '/word-to-pdf', label: 'Word to PDF',  color: 'bg-sky-50    text-sky-700'    },
  { href: '/pdf-to-jpg',  label: 'PDF to JPG',   color: 'bg-amber-50  text-amber-700'  },
];

// ─────────────────────────────────────────────────────────────
// FilePreview
// ─────────────────────────────────────────────────────────────
function FilePreview({
  blobUrl,
  fileName,
  finalName,
  onDownload,
}: {
  blobUrl: string;
  fileName: string;
  finalName: string;
  onDownload: () => void;
}) {
  const ext   = fileName.split('.').pop()?.toLowerCase() ?? '';
  const isPdf = ext === 'pdf';
  const [loaded,     setLoaded]     = useState(false);
  const [iframeErr,  setIframeErr]  = useState(false);

  // Non-PDF: icon card
  if (!isPdf) {
    const icons: Record<string, { label: string; color: string }> = {
      zip:  { label: 'ZIP archive',       color: '#7c3aed' },
      txt:  { label: 'Text file',         color: '#374151' },
      md:   { label: 'Markdown file',     color: '#374151' },
      docx: { label: 'Word document',     color: '#1d4ed8' },
      doc:  { label: 'Word document',     color: '#1d4ed8' },
      xlsx: { label: 'Excel spreadsheet', color: '#166534' },
      pptx: { label: 'PowerPoint file',   color: '#9a3412' },
      csv:  { label: 'CSV file',          color: '#0f766e' },
    };
    const info = icons[ext] ?? { label: `${ext.toUpperCase()} file`, color: '#635a4e' };
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-4 bg-ink-50 rounded-2xl border border-ink-100">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke={info.color} strokeWidth="1.4" aria-hidden="true">
          <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
        <div className="text-center">
          <p className="text-sm font-semibold text-ink-800">{fileName}</p>
          <p className="text-xs text-ink-500 mt-0.5">{info.label} · ready to download</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 font-medium">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Processed successfully
        </span>
      </div>
    );
  }

  // PDF: iframe with custom toolbar containing a Download button
  if (iframeErr) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4 bg-ink-50 rounded-2xl border border-ink-100">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.5" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="12" x2="12" y2="16"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
        <p className="text-sm font-semibold text-ink-800">Preview unavailable</p>
        <p className="text-xs text-ink-500 text-center max-w-xs">
          Your browser blocked the preview. Use the download button to save the file.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-ink-200">
      {/* ── Toolbar with Download button ── */}
      <div className="flex items-center justify-between px-3 py-2 bg-ink-900">
        {/* Left: file name */}
        <div className="flex items-center gap-2 min-w-0">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" aria-hidden="true">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span className="text-[11px] font-mono text-ink-300 truncate max-w-[160px] sm:max-w-xs">
            {fileName}
          </span>
        </div>

        {/* Right: status + download */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-ink-400">
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${loaded ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`} />
            <span className="hidden sm:inline">{loaded ? 'Preview ready' : 'Loading…'}</span>
          </span>

          {/* Download button inside the viewer toolbar */}
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-[11px] font-semibold text-black"
            title={`Download ${finalName}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* ── iframe — native browser PDF renderer, no sandbox ── */}
      <div className="relative bg-white" style={{ height: 480 }}>
        {!loaded && !iframeErr && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10">
            <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-ink-600">Generating preview…</p>
          </div>
        )}
        <iframe
          src={blobUrl}
          title={`Preview: ${fileName}`}
          className="w-full h-full border-0 block"
          onLoad={() => setLoaded(true)}
          onError={() => setIframeErr(true)}
          referrerPolicy="no-referrer"
          aria-label={`PDF preview of ${fileName}`}
        />
      </div>

      <p className="text-center text-[11px] text-ink-400 font-mono py-2 bg-ink-50 border-t border-ink-100">
        Scroll · Zoom · Use the Download button above to save
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DownloadContent
// ─────────────────────────────────────────────────────────────
function DownloadContent() {
  const params   = useSearchParams();
  const cacheKey = params.get('key')   ?? '';
  const rawFile  = params.get('file')  ?? 'processed-file.pdf';
  const tool     = params.get('tool')  ?? '';
  const savedPct = params.get('saved') ?? '';

  const [loadState, setLoadState]   = useState<'loading' | 'ready' | 'expired'>('loading');
  const [blobUrl, setBlobUrl]       = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const ext       = rawFile.includes('.') ? '.' + rawFile.split('.').pop() : '';
  const nameNoExt = rawFile.replace(/\.[^.]+$/, '');
  const [baseName, setBaseName] = useState(nameNoExt);
  const finalName = `${baseName.trim() || nameNoExt}${ext}`;

  useEffect(() => {
    if (!cacheKey) { setLoadState('expired'); return; }
    const entry = retrieveDownload(cacheKey);
    if (entry) { setBlobUrl(entry.blobUrl); setLoadState('ready'); }
    else       { setLoadState('expired'); }

    const handlePageHide = () => releaseDownload(cacheKey);
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [cacheKey]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href     = blobUrl;
    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
  };

  const backHref = tool ? `/${tool}` : '/';

  // ── Expired ──────────────────────────────────────────────────
  if (loadState === 'expired') {
    return (
      <main className="min-h-screen bg-ink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-ink-100 shadow-lg p-10 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 className="text-2xl font-display font-semibold text-ink-900 mb-2">Session expired</h1>
          <p className="text-ink-600 text-sm mb-6">
            This download link is no longer valid. Files are kept in memory for up to 5 minutes — please process your file again.
          </p>
          <Link href={backHref || '/'} className="btn-accent w-full justify-center py-3">
            Process a new file
          </Link>
        </div>
      </main>
    );
  }

  // ── Ready ─────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-b from-ink-50 to-white py-10 px-4">
      <div className="container mx-auto max-w-2xl">

        {/* Header */}
        <div className="text-center mb-7 animate-fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full border-2 border-green-100 mb-4 shadow-sm">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="text-3xl font-display font-semibold text-ink-900 mb-1">Your file is ready!</h1>
          {savedPct && (
            <div className="inline-flex items-center gap-1.5 mt-2 bg-green-50 text-green-800 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              Saved {savedPct}% file size
            </div>
          )}
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl border border-ink-100 shadow-xl overflow-hidden mb-6 animate-fade-up">

          {/* Preview */}
          <div className="p-4 sm:p-5 border-b border-ink-100">
            <p className="text-[11px] font-mono text-ink-500 uppercase tracking-widest mb-3">Preview</p>

            {loadState === 'loading' && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 bg-ink-50 rounded-2xl border border-ink-100">
                <div className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-ink-600">Loading your file…</p>
              </div>
            )}

            {loadState === 'ready' && blobUrl && (
              <FilePreview
                blobUrl={blobUrl}
                fileName={rawFile}
                finalName={finalName}
                onDownload={handleDownload}
              />
            )}
          </div>

          {/* Rename + download */}
          <div className="p-5 sm:p-6">
            <div className="mb-5">
              <label htmlFor="file-name-input" className="block text-sm font-semibold text-ink-800 mb-2">
                Save as
              </label>
              <div className="flex items-stretch rounded-xl border border-ink-200 overflow-hidden focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition-all">
                <input
                  id="file-name-input"
                  type="text"
                  value={baseName}
                  onChange={e => setBaseName(e.target.value)}
                  onFocus={e => e.target.select()}
                  placeholder="Enter file name"
                  className="flex-1 px-4 py-3 text-sm text-ink-900 bg-white outline-none placeholder:text-ink-400 min-w-0"
                  aria-label="Output file name without extension"
                />
                {ext && (
                  <span className="flex items-center px-3 bg-ink-50 border-l border-ink-200 text-sm font-mono text-ink-600 select-none shrink-0">
                    {ext}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-ink-500">
                Will save as <span className="font-mono text-ink-700">{finalName}</span>
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={loadState !== 'ready' || !blobUrl}
              className="btn-accent w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-wait"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              {downloaded ? 'Download again' : `Download ${finalName}`}
            </button>

            <p className="flex items-center justify-center gap-2 mt-4 text-xs text-ink-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Held in memory only · Auto-released after 5 minutes
            </p>
          </div>

          {/* Action links */}
          <div className="px-5 sm:px-6 pb-6 flex flex-col sm:flex-row gap-3">
            <Link href={backHref} className="btn-outline flex-1 justify-center text-sm py-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Process another file
            </Link>
            <Link href="/" className="btn-outline flex-1 justify-center text-sm py-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </Link>
          </div>
        </div>

        {/* Related tools */}
        <div className="mt-4">
          <p className="text-center text-[11px] font-mono tracking-widest text-amber-700 uppercase mb-4">Try other tools</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {toolLinks.map(t => (
              <Link key={t.href} href={t.href}
                className={`flex items-center justify-center px-3 py-2.5 rounded-xl border border-ink-100 text-sm font-medium hover:shadow-sm hover:border-ink-200 transition-all ${t.color}`}>
                {t.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-ink-700">Loading…</p>
        </div>
      </div>
    }>
      <DownloadContent />
    </Suspense>
  );
}
