'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function PdfToPngPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dpi, setDpi] = useState(150);
  const [transparent, setTransparent] = useState(false);
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
      fd.append('dpi', String(dpi));
      fd.append('transparent', String(transparent));
      setProgress(40);
      const res = await fetch('/api/pdf-to-png', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Conversion failed'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'pdf-pages.zip');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=pdf-pages.zip&tool=pdf-to-png`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const dpiLabel = dpi <= 96 ? 'Web / screen (72–96 DPI)' : dpi <= 150 ? 'Standard (150 DPI)' : dpi <= 200 ? 'High quality (200 DPI)' : 'Print quality (300 DPI)';

  return (
    <ToolPageLayout
      title="PDF to PNG"
      description="Convert each PDF page to a lossless PNG image. Transparent background support. Free."
      iconColor="bg-teal-50 text-teal-700"
      toolPath="/pdf-to-png"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone accept=".pdf" multiple={false}
          label="Drop your PDF file here"
          subLabel="Each page will be converted to a PNG image"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
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
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-ink-800">Resolution (DPI)</label>
              <span className="text-xs text-ink-600">{dpiLabel}</span>
            </div>
            <input type="range" min="72" max="300" step="24" value={dpi}
              onChange={e => setDpi(Number(e.target.value))} className="w-full accent-amber-500" />
            <div className="flex justify-between text-xs text-ink-600 mt-1">
              <span>72</span><span>150</span><span>300</span>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={transparent} onChange={e => setTransparent(e.target.checked)} />
              <div className={`w-10 h-6 rounded-full transition-colors ${transparent ? 'bg-amber-500' : 'bg-ink-200'}`} />
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${transparent ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-800">Transparent background</p>
              <p className="text-xs text-ink-700">Remove white background (useful for logos and diagrams)</p>
            </div>
          </label>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Converting to PNG…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">PDF Converted to PNG!</h2>
          <p className="text-ink-700 text-sm mb-6">All pages saved as lossless PNG images in a ZIP archive.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="pdf-pages.zip" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download PNG images (.zip)
            </a>
            <button onClick={handleReset} className="btn-outline">Convert another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleConvert} className="btn-primary flex-1 justify-center py-3.5">
            Convert to PNG
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>PDF to PNG conversion — why choose PNG over JPG?</h2>
        <p>
          PNG uses lossless compression, meaning every pixel is preserved exactly. This makes it ideal for diagrams, charts, text-heavy pages, and any content where sharpness matters. JPG's lossy compression can introduce visible artifacts around text and sharp edges at high compression settings.
        </p>
        <h3>When to use PDF to PNG</h3>
        <p>
          Choose PNG when you need: maximum image quality for print or professional design, transparent backgrounds (e.g., for logos embedded in presentations), archival copies of document pages, or when the output will be further edited in image software.
        </p>
        <h3>What DPI should I choose?</h3>
        <p>
          Use 72–96 DPI for web display, 150 DPI for standard screen use and presentations, 200–300 DPI for print-quality output. Higher DPI produces larger files but sharper images.
        </p>
        <h3>Compare: <Link href="/pdf-to-jpg">PDF to JPG</Link> vs PDF to PNG</h3>
        <p>
          Use JPG for photos and full-colour pages where file size matters. Use PNG for diagrams, text pages, or when you need transparent backgrounds. PNG files are typically 2–5× larger than equivalent JPG files.
        </p>
      </div>
    </ToolPageLayout>
  );
}
