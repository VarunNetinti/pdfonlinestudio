'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

type Degrees = 90 | 180 | 270;

export default function RotatePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [degrees, setDegrees] = useState<Degrees>(90);
  const [pages, setPages] = useState<'all' | 'custom'>('all');
  const [pageRange, setPageRange] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL] = useState('');

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg('');
  };

  const handleRotate = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(15); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('degrees', String(degrees));
      fd.append('pages', pages);
      if (pages === 'custom') fd.append('range', pageRange);
      setProgress(40);
      const res = await fetch('/api/rotate-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Rotation failed'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'rotated.pdf');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=rotated.pdf&tool=rotate`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  return (
    <ToolPageLayout
      title="Rotate PDF"
      description="Rotate all or selected pages of any PDF by 90°, 180°, or 270°. Free and instant."
      iconColor="bg-orange-50 text-orange-700"
      toolPath="/rotate"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone
          accept=".pdf"
          multiple={false}
          label="Drop your PDF file here"
          subLabel="Upload the PDF you want to rotate"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="space-y-6">
          {/* File chip */}
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={handleReset} className="text-ink-600 hover:text-ink-900 text-xs">Remove</button>
          </div>

          {/* Rotation degrees */}
          <div>
            <p className="text-sm font-semibold text-ink-800 mb-3">Rotation angle</p>
            <div className="grid grid-cols-3 gap-3">
              {([90, 180, 270] as Degrees[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDegrees(d)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                    degrees === d
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-ink-200 text-ink-700 hover:border-ink-300'
                  }`}
                >
                  {d === 90 ? '↻ 90°' : d === 180 ? '↻ 180°' : '↺ 270°'}
                </button>
              ))}
            </div>
          </div>

          {/* Pages option */}
          <div>
            <p className="text-sm font-semibold text-ink-800 mb-3">Which pages?</p>
            <div className="flex gap-3 mb-3">
              {(['all', 'custom'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPages(p)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    pages === p
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-ink-200 text-ink-700 hover:border-ink-300'
                  }`}
                >
                  {p === 'all' ? 'All pages' : 'Custom range'}
                </button>
              ))}
            </div>
            {pages === 'custom' && (
              <input
                type="text"
                value={pageRange}
                onChange={e => setPageRange(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-9"
                className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            )}
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Rotating pages…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">PDF Rotated!</h2>
          <p className="text-ink-700 text-sm mb-6">Pages rotated by {degrees}°.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="rotated.pdf" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download rotated.pdf
            </a>
            <button onClick={handleReset} className="btn-outline">Rotate another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleRotate} className="btn-primary flex-1 justify-center py-3.5">
            Rotate PDF
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to rotate a PDF online — free</h2>
        <p>
          Rotating a PDF with PdfOnlineStudio is instant: upload your file, choose your rotation angle (90°, 180°, or 270°), select which pages to rotate, and click Rotate PDF. Your corrected PDF is ready to download in seconds, with no watermarks or sign-up required.
        </p>
        <h3>When do you need to rotate a PDF?</h3>
        <p>
          Scanned documents frequently come out in the wrong orientation — a portrait scan stored as landscape, or pages accidentally flipped during a multi-page scan. Rotating fixes them without re-scanning. Common scenarios include fixing scanned contracts, correcting invoice scans, and straightening presentation exports.
        </p>
        <h3>Can I rotate only specific pages?</h3>
        <p>
          Yes. Use the "Custom range" option and enter a comma-separated list of page numbers or ranges — for example, "1-3, 5, 8-10". Pages not in the range will remain at their original orientation.
        </p>
        <h3>Related tools</h3>
        <p>
          After rotating your PDF, you may also want to <Link href="/merge">merge it with other PDFs</Link>, <Link href="/compress">compress the file size</Link>, or <Link href="/split">split out specific pages</Link>.
        </p>
      </div>
    </ToolPageLayout>
  );
}
