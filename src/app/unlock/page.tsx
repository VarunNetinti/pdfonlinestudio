'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function UnlockPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL] = useState('');

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg(''); setPassword('');
  };

  const handleUnlock = async () => {
    if (!file || !password) return;
    setStatus('processing'); setProgress(20); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('password', password);
      setProgress(50);
      const res = await fetch('/api/unlock-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Unlock failed — check your password'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'unlocked.pdf');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=unlocked.pdf&tool=unlock`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  return (
    <ToolPageLayout
      title="Unlock PDF"
      description="Remove password protection from a PDF you own. Enter your password to decrypt instantly. Free."
      iconColor="bg-yellow-50 text-yellow-700"
      toolPath="/unlock"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 019.9-1"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone accept=".pdf" multiple={false}
          label="Drop your protected PDF here"
          subLabel="Upload the password-protected PDF to unlock"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600">
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

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">PDF password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter the PDF password"
                className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400 pr-12"
              />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-600 hover:text-ink-900 text-xs">
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100 flex gap-2 text-xs text-blue-900">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>This tool removes password protection from PDFs you legitimately own. You must know the correct password.</span>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Removing password…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">PDF Unlocked!</h2>
          <p className="text-ink-700 text-sm mb-6">Password protection removed. The PDF can now be opened freely.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="unlocked.pdf" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download unlocked.pdf
            </a>
            <button onClick={handleReset} className="btn-outline">Unlock another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && password && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleUnlock} className="btn-primary flex-1 justify-center py-3.5">
            Remove Password
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to remove password protection from a PDF</h2>
        <p>
          If you know a PDF's password but want to remove it permanently, upload the file to PdfOnlineStudio, enter the correct password, and click Remove Password. The decrypted PDF is available to download immediately.
        </p>
        <h3>When is this useful?</h3>
        <p>
          Common scenarios: you received a PDF with a password from a client but want to archive it unprotected, you've set a password on your own document and want to remove it, or you need to merge or edit a protected PDF using another tool that doesn't accept encrypted files.
        </p>
        <h3>What if I don't know the password?</h3>
        <p>
          This tool requires you to know the PDF's password. It does not brute-force or crack encrypted PDFs — that would be a security violation for content you don't own. If you've forgotten the password to your own document, contact the original creator.
        </p>
        <h3>Related tools</h3>
        <p>
          After unlocking, you can <Link href="/merge">merge the PDF</Link> with others, <Link href="/compress">compress it</Link>, or <Link href="/protect">re-protect it</Link> with a new password.
        </p>
      </div>
    </ToolPageLayout>
  );
}
