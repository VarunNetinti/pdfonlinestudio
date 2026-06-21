'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function HtmlToPdfPage() {
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
      const res = await fetch('/api/html-to-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      const blob = await res.blob();
      const key = cacheDownload(blob, 'converted.pdf');
      setProgress(100);
      router.push(`/download?key=${key}&file=converted.pdf&tool=html-to-pdf`);
    } catch (err: unknown) {
      setStatus('error'); setErrorMsg(err instanceof Error ? err.message : 'Something went wrong'); setProgress(0);
    }
  };

  return (
    <ToolPageLayout title="HTML to PDF" description="Convert an HTML file or webpage content to a clean PDF document."
      iconColor="bg-orange-50 text-orange-700" toolPath="/html-to-pdf"
      icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>}>

      {!file && <DropZone accept=".html,.htm" multiple={false} label="Drop your file here" subLabel="Select your HTML files file" onFilesSelected={f => { setFile(f[0]); setStatus('idle'); }} />}

      {file && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-700">
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
          <button onClick={handleProcess} className="btn-primary flex-1 justify-center py-3.5">Convert to PDF</button>
          <button onClick={() => { setFile(null); setStatus('idle'); }} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>Convert HTML files to PDF</h2>
        <p>Upload an HTML file to convert its text content to a clean PDF. For pixel-perfect rendering of complex layouts with CSS and JavaScript, the server uses LibreOffice if installed; otherwise text content is extracted and formatted.</p>
        
      </div>
    </ToolPageLayout>
  );
}
