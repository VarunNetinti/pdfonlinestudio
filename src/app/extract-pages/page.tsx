'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function ExtractPagesPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState('');
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [asSingle, setAsSingle] = useState(true);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFile = async (files: File[]) => {
    const f = files[0]; setFile(f); setStatus('idle');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(new Uint8Array(await f.arrayBuffer()), { ignoreEncryption: true });
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
      fd.append('asSingle', String(asSingle));
      setProgress(55);
      const res = await fetch('/api/extract-pages', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      const blob = await res.blob();
      const outName = asSingle ? 'extracted.pdf' : 'extracted-pages.zip';
      const key = cacheDownload(blob, outName);
      setProgress(100);
      router.push(`/download?key=${key}&file=${outName}&tool=extract-pages`);
    } catch (err: unknown) {
      setStatus('error'); setErrorMsg(err instanceof Error ? err.message : 'Something went wrong'); setProgress(0);
    }
  };

  return (
    <ToolPageLayout title="Extract PDF Pages" description="Pull specific pages from a PDF into a new file or individual PDFs."
      iconColor="bg-violet-50 text-violet-700" toolPath="/extract-pages"
      icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>}>

      {!file && <DropZone accept=".pdf" multiple={false} label="Drop your PDF here" subLabel="Select the PDF to extract pages from" onFilesSelected={handleFile} />}

      {file && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600">{pageCount ? `${pageCount} pages` : `${(file.size/1024/1024).toFixed(2)} MB`}</p>
            </div>
            <button onClick={() => { setFile(null); setPageCount(null); }} className="text-ink-600 hover:text-ink-900 text-xs">Remove</button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Pages to extract</label>
            <input type="text" value={pages} onChange={e => setPages(e.target.value)} placeholder="e.g. 1-3, 5, 8"
              className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <p className="text-xs text-ink-500 mt-1.5">{pageCount ? `Document has ${pageCount} pages. ` : ''}Use commas and hyphens: 1, 3-5, 9</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-800 mb-3">Output format</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: true, label: 'Single PDF', desc: 'All extracted pages in one file' },
                { val: false, label: 'Individual PDFs', desc: 'One PDF per page in a ZIP' },
              ].map(o => (
                <button key={String(o.val)} onClick={() => setAsSingle(o.val)}
                  className={`py-3 px-4 rounded-xl border text-left transition-all ${asSingle === o.val ? 'border-amber-500 bg-amber-50' : 'border-ink-200 hover:border-ink-300'}`}>
                  <p className={`text-sm font-semibold ${asSingle === o.val ? 'text-amber-900' : 'text-ink-800'}`}>{o.label}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{o.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6"><ProgressIndicator progress={progress} status={status} label={status === 'processing' ? 'Extracting pages…' : errorMsg} /></div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleProcess} disabled={!pages.trim()} className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">Extract Pages</button>
          <button onClick={() => { setFile(null); setPageCount(null); setPages(''); }} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>Extract specific pages from a PDF</h2>
        <p>Enter the page numbers you want to keep (e.g. "2-5, 8, 11-14") and choose whether to combine them into one PDF or save each as a separate file in a ZIP archive.</p>
        <h3>Related tools</h3>
        <p>To remove unwanted pages instead, use <Link href="/delete-pages">Delete Pages</Link>. To split every page into its own file, use <Link href="/split">Split PDF</Link>.</p>
      </div>
    </ToolPageLayout>
  );
}
