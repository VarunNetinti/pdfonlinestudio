'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export default function WatermarkPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(30);
  const [position, setPosition] = useState<Position>('center');
  const [fontSize, setFontSize] = useState(48);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL] = useState('');

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg('');
  };

  const handleWatermark = async () => {
    if (!file || !text.trim()) return;
    setStatus('processing'); setProgress(15); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('text', text);
      fd.append('opacity', String(opacity));
      fd.append('position', position);
      fd.append('fontSize', String(fontSize));
      setProgress(45);
      const res = await fetch('/api/watermark-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Watermark failed'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'watermarked.pdf');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=watermarked.pdf&tool=watermark`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const positions: { key: Position; label: string }[] = [
    { key: 'center', label: 'Center' },
    { key: 'top-left', label: 'Top left' },
    { key: 'top-right', label: 'Top right' },
    { key: 'bottom-left', label: 'Bottom left' },
    { key: 'bottom-right', label: 'Bottom right' },
  ];

  return (
    <ToolPageLayout
      title="Watermark PDF"
      description="Add custom text watermarks to every page of your PDF. Set opacity, size, and position. Free."
      iconColor="bg-cyan-50 text-cyan-700"
      toolPath="/watermark"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone
          accept=".pdf"
          multiple={false}
          label="Drop your PDF file here"
          subLabel="Upload the PDF you want to watermark"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600">
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

          {/* Watermark text */}
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Watermark text</label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={80}
              placeholder="e.g. CONFIDENTIAL, DRAFT, © 2025"
              className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Font size */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-ink-800">Font size</label>
              <span className="text-sm text-ink-600 font-mono">{fontSize}pt</span>
            </div>
            <input type="range" min="18" max="120" value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
              className="w-full accent-amber-500" />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-ink-800">Opacity</label>
              <span className="text-sm text-ink-600 font-mono">{opacity}%</span>
            </div>
            <input type="range" min="5" max="80" value={opacity} onChange={e => setOpacity(Number(e.target.value))}
              className="w-full accent-amber-500" />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-3">Position</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {positions.map(p => (
                <button key={p.key} onClick={() => setPosition(p.key)}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    position === p.key ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-ink-200 text-ink-700 hover:border-ink-300'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Adding watermark…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">Watermark Added!</h2>
          <p className="text-ink-700 text-sm mb-6">"{text}" added to all pages.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="watermarked.pdf" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download watermarked.pdf
            </a>
            <button onClick={handleReset} className="btn-outline">New file</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && text.trim() && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleWatermark} className="btn-primary flex-1 justify-center py-3.5">
            Add Watermark
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      {file && status === 'idle' && !text.trim() && (
        <p className="mt-4 text-center text-sm text-amber-800 bg-amber-50 rounded-xl py-3 px-4 border border-amber-100">
          Enter watermark text to continue
        </p>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to add a watermark to a PDF — free</h2>
        <p>
          Use PdfOnlineStudio to add custom text watermarks to every page of your PDF in seconds. Upload your file, type your watermark text, adjust the opacity and position, then click Add Watermark. Your stamped PDF is immediately available to download with no watermarks from us.
        </p>
        <h3>Common watermark use cases</h3>
        <p>
          Watermarks serve many purposes: marking documents as DRAFT or CONFIDENTIAL, adding copyright notices, stamping client copies with their name, or indicating document status. Diagonal center watermarks are most common for confidentiality; corner stamps work well for copyright notices.
        </p>
        <h3>What opacity should I use?</h3>
        <p>
          For most purposes, 20–40% opacity works well — the watermark is clearly visible but doesn't obscure the underlying content. Use 10–15% for very subtle branding and 50–70% for strong "DRAFT" or "CONFIDENTIAL" stamps on internal documents.
        </p>
        <h3>Related tools</h3>
        <p>
          You may also want to <Link href="/protect">password-protect your PDF</Link>, <Link href="/compress">reduce the file size</Link>, or <Link href="/merge">combine it with other documents</Link>.
        </p>
      </div>
    </ToolPageLayout>
  );
}
