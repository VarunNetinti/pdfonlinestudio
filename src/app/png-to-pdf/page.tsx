'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import FileList from '@/components/ui/FileList';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

type PageSize = 'A4' | 'Letter' | 'fit';

export default function PngToPdfPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL] = useState('');

  const addFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setStatus('idle'); setDL('');
  };

  const handleRemove = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg('');
  };

  const handleConvert = async () => {
    if (!files.length) return;
    setStatus('processing'); setProgress(10); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      fd.append('pageSize', pageSize);
      setProgress(35);
      const res = await fetch('/api/png-to-pdf', { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Conversion failed'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'images.pdf');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=images.pdf&tool=png-to-pdf`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const pageSizes: { key: PageSize; label: string; desc: string }[] = [
    { key: 'A4', label: 'A4', desc: '210 × 297 mm' },
    { key: 'Letter', label: 'Letter', desc: '8.5 × 11 in' },
    { key: 'fit', label: 'Fit to image', desc: 'Page matches image size' },
  ];

  return (
    <ToolPageLayout
      title="PNG to PDF"
      description="Convert one or more PNG images into a polished PDF. Supports PNG, JPG, WEBP. Free."
      iconColor="bg-teal-50 text-teal-700"
      toolPath="/png-to-pdf"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      }
    >
      {status !== 'success' && (
        <DropZone
          accept=".png,.jpg,.jpeg,.webp"
          multiple
          maxFiles={30}
          label="Drop your images here"
          subLabel="PNG, JPG, WEBP — up to 30 images"
          onFilesSelected={addFiles}
        />
      )}

      {files.length > 0 && status !== 'success' && (
        <div className="mt-6">
          <FileList files={files} onRemove={handleRemove} />
        </div>
      )}

      {files.length > 0 && status !== 'success' && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-ink-800 mb-3">Page size</p>
          <div className="grid grid-cols-3 gap-3">
            {pageSizes.map(p => (
              <button key={p.key} onClick={() => setPageSize(p.key)}
                className={`py-3 px-2 rounded-xl border text-center transition-all ${
                  pageSize === p.key ? 'border-amber-500 bg-amber-50' : 'border-ink-200 hover:border-ink-300'
                }`}>
                <p className={`text-sm font-semibold ${pageSize === p.key ? 'text-amber-900' : 'text-ink-800'}`}>{p.label}</p>
                <p className="text-xs text-ink-600 mt-0.5">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Building PDF…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">PDF Created!</h2>
          <p className="text-ink-700 text-sm mb-6">{files.length} image{files.length > 1 ? 's' : ''} combined into one PDF.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="images.pdf" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download images.pdf
            </a>
            <button onClick={handleReset} className="btn-outline">Convert more</button>
          </div>
        </div>
      )}

      {files.length > 0 && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleConvert} className="btn-primary flex-1 justify-center py-3.5">
            Convert {files.length} image{files.length > 1 ? 's' : ''} to PDF
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to convert PNG images to PDF — free online</h2>
        <p>
          Upload one or more PNG, JPG, or WEBP images to PdfOnlineStudio, choose your preferred page size, and click Convert. All images are placed in sequence in a single PDF document ready to download. No watermarks, no sign-up.
        </p>
        <h3>PNG vs JPG images in PDFs</h3>
        <p>
          PNG images in PDFs preserve transparency and are ideal for screenshots, diagrams, and illustrations. JPG images are better suited for photographs. When building a PDF from PNG files, PdfOnlineStudio embeds them losslessly so every pixel is preserved.
        </p>
        <h3>What page size should I choose?</h3>
        <p>
          A4 (210×297mm) is standard for documents shared internationally. Letter (8.5×11in) is the US standard. "Fit to image" creates a page exactly the size of each image — ideal for photo books or image portfolios where you want no white borders.
        </p>
        <h3>Related tools</h3>
        <p>
          See also: <Link href="/jpg-to-pdf">JPG to PDF</Link>, <Link href="/pdf-to-png">PDF to PNG</Link>, or <Link href="/compress">Compress the resulting PDF</Link>.
        </p>
      </div>
    </ToolPageLayout>
  );
}
