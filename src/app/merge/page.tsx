'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import FileList from '@/components/ui/FileList';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function MergePage() {
  const router = useRouter();
  const [files, setFiles]       = useState<File[]>([]);
  const [status, setStatus]     = useState<'idle' | 'processing' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const addFiles    = (newFiles: File[]) => { setFiles(prev => [...prev, ...newFiles]); setStatus('idle'); };
  const handleRemove = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleMerge = async () => {
    if (files.length < 2) return;
    setStatus('processing'); setProgress(10); setErrorMsg('');
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      setProgress(35);
      const res = await fetch('/api/merge-pdf', { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Merge failed'); }
      const blob      = await res.blob();
      const outName   = 'merged.pdf';
      const _cacheKey = cacheDownload(blob, outName);
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=${encodeURIComponent(outName)}&tool=merge`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const handleReset = () => { setFiles([]); setStatus('idle'); setProgress(0); setErrorMsg(''); };

  return (
    <ToolPageLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Free, fast, and secure."
      iconColor="bg-blue-50 text-blue-700"
      toolPath="/merge"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
          <rect x="8" y="8" width="12" height="12" rx="2"/>
        </svg>
      }
    >
      <DropZone
        accept=".pdf"
        multiple
        maxFiles={20}
        label="Drop your PDF files here"
        subLabel="Add at least 2 PDF files — drag to reorder"
        onFilesSelected={addFiles}
      />

      {files.length > 0 && (
        <div className="mt-6"><FileList files={files} onRemove={handleRemove} /></div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Merging PDFs…' : errorMsg} />
        </div>
      )}

      {files.length >= 2 && status === 'idle' && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button onClick={handleMerge} className="btn-primary flex-1 justify-center py-3.5">
            Merge {files.length} PDFs
          </button>
          <button onClick={handleReset} className="btn-outline">Clear all</button>
        </div>
      )}

      {files.length === 1 && status === 'idle' && (
        <p className="mt-4 text-center text-sm text-amber-800 bg-amber-50 rounded-xl py-3 px-4 border border-amber-100">
          Add at least one more PDF to merge
        </p>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to merge PDF files online — free</h2>
        <p>Merging PDF files with PdfOnlineStudio takes three steps: upload your PDFs, confirm the order, and click Merge. The combined PDF is ready to download in seconds. No account, no watermarks, no file size limits beyond 100 MB per file.</p>
        <h3>Why merge PDF files?</h3>
        <p>Combining multiple PDF documents into one makes sharing easier. Common use cases include: combining contract pages, assembling multi-chapter reports, collating scanned documents, and packaging invoice sets.</p>
        <h3>Tips for merging PDFs</h3>
        <ul>
          <li>Upload files in the order you want them in the final document</li>
          <li>You can remove individual files from the list before merging</li>
          <li>All fonts and embedded images are preserved from source files</li>
        </ul>
      </div>
    </ToolPageLayout>
  );
}
