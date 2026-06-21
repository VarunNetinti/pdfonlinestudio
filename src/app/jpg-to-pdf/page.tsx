'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import FileList from '@/components/ui/FileList';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

type PageSize = 'A4' | 'Letter' | 'fit';

const pageSizes: { key: PageSize; label: string; desc: string }[] = [
  { key: 'A4',     label: 'A4',           desc: '210 × 297 mm' },
  { key: 'Letter', label: 'US Letter',    desc: '8.5 × 11 in' },
  { key: 'fit',    label: 'Fit to image', desc: 'Match image size' },
];

export default function JpgToPdfPage() {
  const router = useRouter();
  const [files, setFiles]       = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [status, setStatus]     = useState<'idle'|'processing'|'success'|'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL]    = useState('');

  const addFiles  = (f: File[]) => { setFiles(prev => [...prev, ...f]); setStatus('idle'); setDL(''); };
  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

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
      const res = await fetch('/api/jpg-to-pdf', { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Conversion failed'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'images.pdf');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=images.pdf&tool=jpg-to-pdf`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  return (
    <ToolPageLayout
      title="JPG to PDF"
      description="Combine one or more images into a polished PDF document. Free, no watermarks."
      iconColor="bg-rose-50 text-rose-700"
      toolPath="/jpg-to-pdf"
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
          accept=".jpg,.jpeg,.png,.webp"
          multiple maxFiles={30}
          label="Drop your images here"
          subLabel="JPG, PNG, WEBP — up to 30 images"
          onFilesSelected={addFiles}
        />
      )}

      {files.length > 0 && status !== 'success' && (
        <div className="mt-6 space-y-6">
          <FileList files={files} onRemove={removeFile} />

          {/* Page size */}
          <fieldset>
            <legend className="text-sm font-semibold text-ink-800 mb-3">Output page size</legend>
            <div className="grid grid-cols-3 gap-2">
              {pageSizes.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setPageSize(opt.key)}
                  aria-pressed={pageSize === opt.key}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${pageSize === opt.key ? 'border-ink-800 bg-ink-50' : 'border-ink-100 hover:border-ink-300'}`}
                >
                  <p className="text-sm font-semibold text-ink-900">{opt.label}</p>
                  <p className="text-xs text-ink-600 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Info box */}
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm text-rose-800">
            <p className="font-semibold mb-1">📄 How images are placed</p>
            <p>Each image is centred on its page with the original aspect ratio preserved. No cropping occurs.</p>
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">PDF Created!</h2>
          <p className="text-ink-700 text-sm mb-6">
            {files.length} image{files.length > 1 ? 's' : ''} combined into a {pageSize === 'fit' ? 'custom-size' : pageSize} PDF.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="images.pdf" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download images.pdf
            </a>
            <button onClick={handleReset} className="btn-outline">Convert more images</button>
          </div>
        </div>
      )}

      {files.length > 0 && status === 'idle' && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button onClick={handleConvert} className="btn-primary flex-1 justify-center py-3.5">
            Convert {files.length} image{files.length > 1 ? 's' : ''} to PDF
          </button>
          <button onClick={handleReset} className="btn-outline">Clear all</button>
        </div>
      )}

      {/* ── SEO content ── */}
      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to convert JPG images to PDF online — free</h2>
        <p>
          Converting images to PDF with PdfOnlineStudio lets you combine photos, scans, screenshots, or graphics into a single professional document. Upload your images, choose a page size, and download your PDF in seconds.
        </p>
        <h3>Which image formats are supported?</h3>
        <p>
          PdfOnlineStudio supports <strong>JPG / JPEG</strong>, <strong>PNG</strong>, and <strong>WEBP</strong> image formats. You can mix different formats in a single conversion — for example, combine a PNG logo page with JPG photo pages.
        </p>
        <h3>Which page size should I use?</h3>
        <ul>
          <li><strong>A4</strong> — standard international paper size, ideal for documents, reports, and most printed materials</li>
          <li><strong>US Letter</strong> — standard North American paper size (8.5 × 11 inches), preferred in the United States and Canada</li>
          <li><strong>Fit to image</strong> — creates a page exactly the size of your image, with no borders or margins. Best for digital-only PDFs where exact sizing matters</li>
        </ul>
        <h3>Common uses for JPG to PDF conversion</h3>
        <ul>
          <li>Combining multiple scanned pages into a single document</li>
          <li>Converting a photo portfolio into a shareable PDF</li>
          <li>Packaging screenshots as a PDF report</li>
          <li>Converting WhatsApp or mobile photos into a professional document</li>
          <li>Creating a PDF from images for email or print submission</li>
        </ul>
        <h3>Is the image quality preserved?</h3>
        <p>
          Yes. PdfOnlineStudio embeds your images directly into the PDF at 90% JPEG quality — which is effectively lossless for most images. No visible compression artifacts are introduced. Aspect ratios are always preserved.
        </p>
      </div>
    </ToolPageLayout>
  );
}
