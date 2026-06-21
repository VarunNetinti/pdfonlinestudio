'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function PdfToExcelPage() {
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
      const res = await fetch('/api/pdf-to-excel', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      const blob = await res.blob();
      const key = cacheDownload(blob, 'converted.xlsx');
      setProgress(100);
      router.push(`/download?key=${key}&file=converted.xlsx&tool=pdf-to-excel`);
    } catch (err: unknown) {
      setStatus('error'); setErrorMsg(err instanceof Error ? err.message : 'Something went wrong'); setProgress(0);
    }
  };

  return (
    <ToolPageLayout title="PDF to Excel" description="Convert PDF tables and data to an editable Excel spreadsheet (.xlsx)."
      iconColor="bg-green-50 text-green-700" toolPath="/pdf-to-excel"
      icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>}>

      {!file && <DropZone accept=".pdf" multiple={false} label="Drop your PDF here" subLabel="Select your PDF file" onFilesSelected={f => { setFile(f[0]); setStatus('idle'); }} />}

      {file && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-700">
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
          <button onClick={handleProcess} className="btn-primary flex-1 justify-center py-3.5">Convert to Excel</button>
          <button onClick={() => { setFile(null); setStatus('idle'); }} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>Convert PDF tables to Excel</h2>
        <p>Extract tabular data from PDF documents into editable Excel spreadsheets. Best results with PDFs that contain structured tables. For complex multi-column layouts, LibreOffice is used on the server for accurate extraction.</p>
        <h3>Server requirements</h3><p>Full conversion quality requires LibreOffice installed on the server. When LibreOffice is not available, a summary PDF is returned instead. Install LibreOffice on your deployment server (e.g. <code>apt-get install libreoffice</code>) for complete support.</p>
      </div>
    </ToolPageLayout>
  );
}
