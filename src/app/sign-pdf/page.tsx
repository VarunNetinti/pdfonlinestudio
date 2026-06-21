'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function SignPdfPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [sigText, setSigtext] = useState('');

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(20); setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('sigText', sigText);
      setProgress(55);
      const res = await fetch('/api/sign-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      const blob = await res.blob();
      const key = cacheDownload(blob, 'signed.pdf');
      setProgress(100);
      router.push(`/download?key=${key}&file=signed.pdf&tool=sign-pdf`);
    } catch (err: unknown) {
      setStatus('error'); setErrorMsg(err instanceof Error ? err.message : 'Something went wrong'); setProgress(0);
    }
  };

  return (
    <ToolPageLayout title="Sign PDF" description="Add your typed or drawn signature to any PDF page. No account needed."
      iconColor="bg-blue-50 text-blue-700" toolPath="/sign-pdf"
      icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20 20H7L3 16V4a1 1 0 011-1h16a1 1 0 011 1v15a1 1 0 01-1 1zM15 9l-6 6M9 9l6 6"/></svg>}>

      {!file && <DropZone accept=".pdf" multiple={false} label="Drop your PDF here" subLabel="Select your PDF file" onFilesSelected={f => { setFile(f[0]); setStatus('idle'); }} />}

      {file && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600">{(file.size/1024/1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setStatus('idle'); }} className="text-ink-600 hover:text-ink-900 text-xs">Remove</button>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Your signature (type your name)</label>
            <input type="text" value={sigText} onChange={e => setSigtext(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6"><ProgressIndicator progress={progress} status={status} label={status === 'processing' ? 'Processing…' : errorMsg} /></div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleProcess} className="btn-primary flex-1 justify-center py-3.5">Add Signature</button>
          <button onClick={() => { setFile(null); setStatus('idle'); }} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to sign a PDF online</h2>
        <p>Type your name to create a digital signature overlay, or upload an image of your handwritten signature. The signature is embedded directly into the PDF pages — no third-party account or subscription required.</p>
        
      </div>
    </ToolPageLayout>
  );
}
