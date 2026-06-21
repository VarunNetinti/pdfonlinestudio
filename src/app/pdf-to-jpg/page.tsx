'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function PdfToJpgPage() {
  const router = useRouter();
  const [file, setFile]         = useState<File | null>(null);
  const [dpi, setDpi]           = useState(150);
  const [status, setStatus]     = useState<'idle'|'processing'|'success'|'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL]    = useState('');

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg('');
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(10); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('dpi', String(dpi));
      setProgress(40);
      const res = await fetch('/api/pdf-to-jpg', { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Conversion failed'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'pdf-pages.zip');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=pdf-pages.zip&tool=pdf-to-jpg`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const dpiLabel = dpi <= 96 ? 'Web / screen' : dpi <= 150 ? 'Standard' : dpi <= 200 ? 'High quality' : 'Print quality';

  return (
    <ToolPageLayout
      title="PDF to JPG"
      description="Convert each page of your PDF into a high-resolution JPG image. Free, adjustable DPI."
      iconColor="bg-amber-50 text-amber-700"
      toolPath="/pdf-to-jpg"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone
          accept=".pdf" multiple={false}
          label="Drop your PDF file here"
          subLabel="Each page will be converted to a JPG image"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="space-y-6">
          {/* File chip */}
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={handleReset} className="text-ink-700 hover:text-red-600 p-1 transition-colors" aria-label="Remove file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* DPI slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="dpi-slider" className="text-sm font-semibold text-ink-800">
                Image resolution (DPI)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                  {dpi} DPI
                </span>
                <span className="text-xs text-ink-600">{dpiLabel}</span>
              </div>
            </div>
            <input
              id="dpi-slider"
              type="range"
              min={72} max={300} step={1}
              value={dpi}
              onChange={e => setDpi(Number(e.target.value))}
              className="w-full accent-amber-500"
              aria-valuemin={72}
              aria-valuemax={300}
              aria-valuenow={dpi}
              aria-valuetext={`${dpi} DPI — ${dpiLabel}`}
            />
            <div className="flex justify-between text-xs text-ink-600 mt-1.5 font-mono">
              <span>72 dpi</span>
              <span>150 dpi</span>
              <span>300 dpi</span>
            </div>
          </div>

          {/* DPI guide */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { dpi: '72–96',  label: 'Web / email', desc: 'Smallest file' },
              { dpi: '150',    label: 'Standard',    desc: 'Best balance' },
              { dpi: '300',    label: 'Print',       desc: 'Highest quality' },
            ].map(g => (
              <div key={g.dpi} className="p-3 bg-ink-50 rounded-xl border border-ink-100">
                <p className="text-xs font-mono font-bold text-ink-800">{g.dpi}</p>
                <p className="text-xs font-medium text-ink-700 mt-0.5">{g.label}</p>
                <p className="text-[10px] text-ink-600 mt-0.5">{g.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">📦 Output format</p>
            <p>All pages will be converted to individual JPG files and packaged in a single ZIP archive for download.</p>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Converting to JPG…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">Conversion Complete!</h2>
          <p className="text-ink-700 text-sm mb-6">Your PDF pages have been converted to JPG images at {dpi} DPI.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="pdf-images.zip" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download JPG Images (ZIP)
            </a>
            <button onClick={handleReset} className="btn-outline">Convert another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6">
          <button onClick={handleConvert} className="btn-primary w-full justify-center py-3.5">
            Convert to JPG
          </button>
        </div>
      )}

      {/* ── SEO content ── */}
      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to convert PDF to JPG online — free</h2>
        <p>
          Converting a PDF to JPG images with PdfOnlineStudio takes seconds. Upload your PDF, set your desired image resolution (DPI), and download all converted pages as a ZIP file. Each page of the PDF becomes a separate JPG image — perfect for presentations, social media, or web use.
        </p>
        <h3>What DPI should I use?</h3>
        <p>
          <strong>72–96 DPI</strong> is ideal for web display and email. Files are small and load quickly.
          <strong>150 DPI</strong> is the recommended setting for most uses — good image quality with manageable file sizes.
          <strong>300 DPI</strong> produces print-quality images with the sharpest detail, but creates larger files.
        </p>
        <h3>Why convert PDF to JPG?</h3>
        <ul>
          <li>Share individual pages on social media or messaging apps</li>
          <li>Embed PDF content in websites as images</li>
          <li>Create thumbnails or previews of document pages</li>
          <li>Use PDF charts or diagrams in presentations (PowerPoint, Google Slides)</li>
          <li>Make text in a scanned PDF visible and searchable via OCR tools</li>
        </ul>
        <h3>Does converting PDF to JPG lose quality?</h3>
        <p>
          At 150 DPI and above, converted images look sharp and clear. The only loss occurs when vector graphics are rasterized — they cannot be infinitely scaled once converted to JPG. Use 300 DPI if your PDF contains fine-detail technical drawings or diagrams.
        </p>
      </div>
    </ToolPageLayout>
  );
}
