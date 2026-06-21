'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function CropPdfPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [cropTop, setCropTop]       = useState(0);
  const [cropRight, setCropRight]   = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  const [cropLeft, setCropLeft]     = useState(0);

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(20); setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('top', String(cropTop));
      fd.append('right', String(cropRight));
      fd.append('bottom', String(cropBottom));
      fd.append('left', String(cropLeft));
      setProgress(55);
      const res = await fetch('/api/crop-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      const blob = await res.blob();
      const key = cacheDownload(blob, 'cropped.pdf');
      setProgress(100);
      router.push(`/download?key=${key}&file=cropped.pdf&tool=crop-pdf`);
    } catch (err: unknown) {
      setStatus('error'); setErrorMsg(err instanceof Error ? err.message : 'Something went wrong'); setProgress(0);
    }
  };

  return (
    <ToolPageLayout title="Crop PDF" description="Trim the margins of PDF pages by specifying crop amounts for each side."
      iconColor="bg-cyan-50 text-cyan-700" toolPath="/crop-pdf"
      icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 2v4M18 2v4M2 6h4M18 6h4M6 22v-4M18 22v-4M2 18h4M18 18h4M8 8h8v8H8z"/></svg>}>

      {!file && <DropZone accept=".pdf" multiple={false} label="Drop your PDF here" subLabel="Select your PDF file" onFilesSelected={f => { setFile(f[0]); setStatus('idle'); }} />}

      {file && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600">{(file.size/1024/1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setStatus('idle'); }} className="text-ink-600 hover:text-ink-900 text-xs">Remove</button>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-ink-800 mb-3">Crop margins (% of page size)</p>
            <div className="grid grid-cols-2 gap-4">
              {[['Top', cropTop, setCropTop],['Right', cropRight, setCropRight],['Bottom', cropBottom, setCropBottom],['Left', cropLeft, setCropLeft]].map(([label, val, setter]) => (
                <div key={label as string}>
                  <label className="block text-xs text-ink-600 mb-1">{label as string}: {val as number}%</label>
                  <input type="range" min="0" max="40" step="1" value={val as number}
                    onChange={e => (setter as (v: number) => void)(Number(e.target.value))}
                    className="w-full accent-amber-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6"><ProgressIndicator progress={progress} status={status} label={status === 'processing' ? 'Processing…' : errorMsg} /></div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleProcess} className="btn-primary flex-1 justify-center py-3.5">Crop PDF</button>
          <button onClick={() => { setFile(null); setStatus('idle'); }} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>Crop PDF margins online</h2>
        <p>Remove unwanted white space or trim scanned borders from PDF pages. Set crop amounts (in percent) for the top, right, bottom, and left sides. Applied to all pages simultaneously.</p>
        
      </div>
    </ToolPageLayout>
  );
}
