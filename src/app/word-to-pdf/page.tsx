'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function WordToPdfPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL] = useState('');

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg('');
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(20); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      setProgress(45);
      const res = await fetch('/api/word-to-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Conversion failed'); }
      const blob = await res.blob();
      const outName = file!.name.replace(/\.(docx?|odt|rtf)$/i, '.pdf');
      const _cacheKey = cacheDownload(blob, outName);
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=${encodeURIComponent(outName)}&tool=word-to-pdf`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const outName = file ? file.name.replace(/\.(docx?|odt|rtf)$/i, '.pdf') : 'document.pdf';

  return (
    <ToolPageLayout
      title="Word to PDF"
      description="Convert .docx, .doc, .odt, or .rtf files to PDF. Layout and formatting preserved. Free."
      iconColor="bg-blue-50 text-blue-700"
      toolPath="/word-to-pdf"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone
          accept=".doc,.docx,.odt,.rtf"
          multiple={false}
          label="Drop your Word document here"
          subLabel=".docx · .doc · .odt · .rtf — up to 50 MB"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              <p className="text-xs text-ink-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={handleReset} className="text-ink-600 hover:text-ink-900 text-xs">Remove</button>
          </div>

          <div className="bg-ink-50 rounded-xl p-4 flex items-start gap-3 border border-ink-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <div>
              <p className="text-sm font-semibold text-ink-800 mb-1">Output: {outName}</p>
              <p className="text-xs text-ink-600">Fonts, tables, images and layout will be preserved in the PDF.</p>
            </div>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Converting to PDF…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">Converted to PDF!</h2>
          <p className="text-ink-700 text-sm mb-6">Your document is ready to download.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download={outName} className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download {outName}
            </a>
            <button onClick={handleReset} className="btn-outline">Convert another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleConvert} className="btn-primary flex-1 justify-center py-3.5">
            Convert to PDF
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to convert Word to PDF — free online</h2>
        <p>
          Upload your .docx, .doc, .odt, or .rtf file to PdfOnlineStudio and click Convert to PDF. The conversion preserves your document's fonts, tables, images, headers, footers, and layout. The resulting PDF is ready to share, print, or archive.
        </p>
        <h3>Why convert Word documents to PDF?</h3>
        <p>
          PDF is the universal format for sharing final documents. Unlike Word files, PDFs look identical on every device and operating system, cannot be accidentally edited, and are accepted by courts, government agencies, and professional services. PDFs also tend to be smaller than .docx files.
        </p>
        <h3>Will my formatting be preserved?</h3>
        <p>
          Yes — fonts, images, tables, column layouts, headers and footers, bullet lists, and page numbering are all preserved in the output PDF. Complex documents with custom fonts may require those fonts to be embedded; PdfOnlineStudio handles this automatically.
        </p>
        <h3>Related tools</h3>
        <p>
          After converting, you can <Link href="/compress">compress the PDF</Link> to reduce file size, <Link href="/merge">merge it with other documents</Link>, or <Link href="/protect">password-protect it</Link> before sharing.
        </p>
      </div>
    </ToolPageLayout>
  );
}
