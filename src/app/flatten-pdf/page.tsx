'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function FlattenPdfPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(20); setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      
      setProgress(55);
      const res = await fetch('/api/flatten-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      const blob = await res.blob();
      const key = cacheDownload(blob, 'flattened.pdf');
      setProgress(100);
      router.push(`/download?key=${key}&file=flattened.pdf&tool=flatten-pdf`);
    } catch (err: unknown) {
      setStatus('error'); setErrorMsg(err instanceof Error ? err.message : 'Something went wrong'); setProgress(0);
    }
  };

  return (
    <ToolPageLayout title="Flatten PDF" description="Convert interactive PDF forms and annotations into static, uneditable content."
      iconColor="bg-slate-50 text-slate-700" toolPath="/flatten-pdf"
      icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>}>

      {!file && <DropZone accept=".pdf" multiple={false} label="Drop your PDF here" subLabel="Select your PDF file" onFilesSelected={f => { setFile(f[0]); setStatus('idle'); }} />}

      {file && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600">{(file.size/1024/1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setStatus('idle'); }} className="text-ink-600 hover:text-ink-900 text-xs">Remove</button>
          </div>
          
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6"><ProgressIndicator progress={progress} status={status} label={status === 'processing' ? 'Processing…' : errorMsg} /></div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleProcess} className="btn-primary flex-1 justify-center py-3.5">Flatten PDF</button>
          <button onClick={() => { setFile(null); setStatus('idle'); }} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>What does flattening a PDF do?</h2>
        <p>Flattening converts interactive form fields, checkboxes, and annotations into fixed, non-editable content. The visual output looks identical, but recipients can no longer modify form values. This is essential before archiving filled forms or sending final documents.</p>
        
      </div>
    </ToolPageLayout>
  );
}
