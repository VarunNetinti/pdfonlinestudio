'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function DeletePagesPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState('');
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setStatus('idle');
    // Quick page count via pdf-lib in browser
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(new Uint8Array(buf), { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch { setPageCount(null); }
  };

  const handleProcess = async () => {
    if (!file || !pages.trim()) return;
    setStatus('processing'); setProgress(20); setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('pages', pages);
      setProgress(50);
      const res = await fetch('/api/delete-pages', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      const blob = await res.blob();
      const key = cacheDownload(blob, 'deleted-pages.pdf');
      setProgress(100);
      router.push(`/download?key=${key}&file=deleted-pages.pdf&tool=delete-pages`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  return (
    <ToolPageLayout
      title="Delete PDF Pages"
      description="Remove specific pages from a PDF. Enter page numbers or ranges to delete permanently."
      iconColor="bg-red-50 text-red-700"
      toolPath="/delete-pages"
      icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>}
    >
      {!file && <DropZone accept=".pdf" multiple={false} label="Drop your PDF here" subLabel="Select the PDF to remove pages from" onFilesSelected={handleFile} />}

      {file && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600">{pageCount ? `${pageCount} pages` : `${(file.size / 1024 / 1024).toFixed(2)} MB`}</p>
            </div>
            <button onClick={() => { setFile(null); setPageCount(null); setPages(''); }} className="text-ink-600 hover:text-ink-900 text-xs">Remove</button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Pages to delete</label>
            <input type="text" value={pages} onChange={e => setPages(e.target.value)} placeholder="e.g. 1, 3-5, 8"
              className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <p className="text-xs text-ink-500 mt-1.5">Separate individual pages with commas, use hyphens for ranges. {pageCount ? `Document has ${pageCount} pages.` : ''}</p>
          </div>

          <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 text-xs text-amber-900 flex gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Page deletion is permanent in the output file. The original file on your device is not affected.
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6"><ProgressIndicator progress={progress} status={status} label={status === 'processing' ? 'Removing pages…' : errorMsg} /></div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleProcess} disabled={!pages.trim()} className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">Delete Pages</button>
          <button onClick={() => { setFile(null); setPageCount(null); setPages(''); setStatus('idle'); }} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to delete pages from a PDF</h2>
        <p>Upload your PDF, enter the page numbers you want to remove (e.g. "3, 5-8, 12"), and click Delete Pages. The result is a new PDF with those pages permanently removed — your original file is unchanged.</p>
        <h3>Page range syntax</h3>
        <p>Single pages: <code>3</code> or <code>1, 4, 7</code>. Ranges: <code>3-8</code>. Combined: <code>1, 3-5, 9-11</code>. Pages are counted from 1.</p>
        <h3>Related tools</h3>
        <p>To keep specific pages instead of deleting, use <Link href="/extract-pages">Extract Pages</Link>. To rearrange pages, use <Link href="/merge">Merge PDF</Link>.</p>
      </div>
    </ToolPageLayout>
  );
}
