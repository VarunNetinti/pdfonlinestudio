'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

type Position = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
type Format = '1' | 'Page 1' | '1 / N' | 'Page 1 of N';

export default function PageNumbersPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [format, setFormat] = useState<Format>('1');
  const [startAt, setStartAt] = useState(1);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL] = useState('');

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg('');
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(15); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('position', position);
      fd.append('format', format);
      fd.append('startAt', String(startAt));
      setProgress(45);
      const res = await fetch('/api/page-numbers', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to add page numbers'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'numbered.pdf');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=numbered.pdf&tool=page-numbers`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const positions: { key: Position; label: string }[] = [
    { key: 'bottom-center', label: 'Bottom center' },
    { key: 'bottom-right', label: 'Bottom right' },
    { key: 'bottom-left', label: 'Bottom left' },
    { key: 'top-center', label: 'Top center' },
    { key: 'top-right', label: 'Top right' },
    { key: 'top-left', label: 'Top left' },
  ];

  const formats: Format[] = ['1', 'Page 1', '1 / N', 'Page 1 of N'];

  return (
    <ToolPageLayout
      title="Add Page Numbers"
      description="Add page numbers to any PDF. Choose position, format, and starting number. Free."
      iconColor="bg-indigo-50 text-indigo-700"
      toolPath="/page-numbers"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="18" x2="10" y2="18"/>
          <line x1="14" y1="18" x2="16" y2="18"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone accept=".pdf" multiple={false}
          label="Drop your PDF file here"
          subLabel="Upload the PDF to add page numbers"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
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
            <label className="block text-sm font-semibold text-ink-800 mb-3">Number format</label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`py-2.5 rounded-xl border text-sm font-mono transition-all ${
                    format === f ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-ink-200 text-ink-700 hover:border-ink-300'
                  }`}>
                  {f.replace('N', '12')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-3">Position</label>
            <div className="grid grid-cols-2 gap-2">
              {positions.map(p => (
                <button key={p.key} onClick={() => setPosition(p.key)}
                  className={`py-2.5 rounded-xl border text-sm transition-all ${
                    position === p.key ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-ink-200 text-ink-700 hover:border-ink-300'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Start numbering at</label>
            <input type="number" min="1" max="999" value={startAt}
              onChange={e => setStartAt(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-28 px-4 py-2.5 rounded-xl border border-ink-200 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Adding page numbers…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">Page Numbers Added!</h2>
          <p className="text-ink-700 text-sm mb-6">Every page now has a {format} number at the {position.replace('-', ' ')}.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="numbered.pdf" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download numbered.pdf
            </a>
            <button onClick={handleReset} className="btn-outline">Process another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleProcess} className="btn-primary flex-1 justify-center py-3.5">
            Add Page Numbers
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to add page numbers to a PDF — free online</h2>
        <p>
          PdfOnlineStudio adds page numbers to every page of your PDF in seconds. Upload your file, choose where numbers appear (header or footer, left, center, or right), select the format, and click Add Page Numbers. Your numbered PDF is ready instantly.
        </p>
        <h3>Why add page numbers to a PDF?</h3>
        <p>
          Page numbers are essential for multi-page professional documents — contracts, reports, proposals, and academic papers all benefit from numbered pages. They make navigation easier, help readers reference specific sections, and are often required by formatting standards.
        </p>
        <h3>What page number formats are available?</h3>
        <p>
          PdfOnlineStudio offers four formats: plain numbers ("1, 2, 3"), "Page 1" style, "1 / 12" fraction format, and "Page 1 of 12" long form. The "of N" formats are best for multi-part documents where readers need context about total length.
        </p>
        <h3>Related tools</h3>
        <p>
          You can also <Link href="/merge">merge multiple PDFs</Link> first, then add page numbers to the combined document. Or <Link href="/split">split a PDF</Link> and number each section independently.
        </p>
      </div>
    </ToolPageLayout>
  );
}
