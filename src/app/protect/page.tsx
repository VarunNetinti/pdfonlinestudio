'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolPageLayout from '@/components/ui/ToolPageLayout';
import DropZone from '@/components/ui/DropZone';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cacheDownload } from '@/lib/downloadCache';

export default function ProtectPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDL] = useState('');

  const mismatch = confirmPw.length > 0 && password !== confirmPw;
  const canSubmit = file && password.length >= 6 && password === confirmPw;

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setStatus('idle'); setProgress(0); setDL(''); setErrorMsg('');
    setPassword(''); setConfirmPw('');
  };

  const handleProtect = async () => {
    if (!canSubmit) return;
    setStatus('processing'); setProgress(15); setErrorMsg(''); setDL('');
    try {
      const fd = new FormData();
      fd.append('file', file!);
      fd.append('password', password);
      setProgress(45);
      const res = await fetch('/api/protect-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Protection failed'); }
      const blob = await res.blob();
      const _cacheKey = cacheDownload(blob, 'protected.pdf');
      setProgress(100);
      router.push(`/download?key=${_cacheKey}&file=protected.pdf&tool=protect`);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setProgress(0);
    }
  };

  const strength = password.length === 0 ? '' : password.length < 6 ? 'weak' : password.length < 10 ? 'fair' : password.match(/[^a-zA-Z0-9]/) ? 'strong' : 'good';

  return (
    <ToolPageLayout
      title="Protect PDF"
      description="Add password protection to any PDF. Encrypt with 256-bit AES. Free, no sign-up."
      iconColor="bg-red-50 text-red-700"
      toolPath="/protect"
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      }
    >
      {!file && status !== 'success' && (
        <DropZone accept=".pdf" multiple={false}
          label="Drop your PDF file here"
          subLabel="Upload the PDF to password protect"
          onFilesSelected={f => { setFile(f[0]); setStatus('idle'); setDL(''); }}
        />
      )}

      {file && status !== 'success' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-ink-50 rounded-xl border border-ink-100">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
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
            <label className="block text-sm font-semibold text-ink-800 mb-2">Set password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400 pr-12"
              />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-600 hover:text-ink-900 text-xs">
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
            {strength && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  {['weak','fair','good','strong'].map((s, i) => (
                    <div key={s} className={`h-1 w-8 rounded-full transition-colors ${
                      ['weak','fair','good','strong'].indexOf(strength) >= i
                        ? strength === 'weak' ? 'bg-red-400' : strength === 'fair' ? 'bg-amber-400' : 'bg-green-400'
                        : 'bg-ink-100'
                    }`} />
                  ))}
                </div>
                <span className={`text-xs font-medium capitalize ${
                  strength === 'weak' ? 'text-red-600' : strength === 'fair' ? 'text-amber-600' : 'text-green-600'
                }`}>{strength}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Confirm password</label>
            <input
              type={show ? 'text' : 'password'}
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                mismatch ? 'border-red-300 bg-red-50' : 'border-ink-200'
              }`}
            />
            {mismatch && <p className="text-xs text-red-600 mt-1">Passwords don't match</p>}
          </div>

          <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 flex gap-2 text-xs text-amber-900">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Save your password carefully. We cannot recover it — encrypted PDFs cannot be opened without the correct password.</span>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'error') && (
        <div className="mt-6">
          <ProgressIndicator progress={progress} status={status}
            label={status === 'processing' ? 'Encrypting PDF…' : errorMsg} />
        </div>
      )}

      {status === 'success' && downloadUrl && (
        <div className="text-center py-8 animate-fade-up">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">PDF Protected!</h2>
          <p className="text-ink-700 text-sm mb-6">Encrypted with 256-bit AES. Your password is required to open this file.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={downloadUrl} download="protected.pdf" className="btn-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download protected.pdf
            </a>
            <button onClick={handleReset} className="btn-outline">Protect another</button>
          </div>
        </div>
      )}

      {file && status === 'idle' && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleProtect} disabled={!canSubmit}
            className={`btn-primary flex-1 justify-center py-3.5 ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Protect PDF
          </button>
          <button onClick={handleReset} className="btn-outline">Clear</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-ink-100 seo-prose">
        <h2>How to password protect a PDF — free</h2>
        <p>
          PdfOnlineStudio encrypts your PDF using 256-bit AES encryption — the same standard used by banks and government agencies. Upload your file, set a password, and click Protect PDF. The encrypted file is ready to download instantly.
        </p>
        <h3>What does PDF password protection do?</h3>
        <p>
          Password-protecting a PDF (also called encrypting it) requires anyone who opens the file to enter the correct password. Without it, the document cannot be opened. This protects sensitive content like contracts, financial statements, medical records, and personal identification documents.
        </p>
        <h3>Tips for strong PDF passwords</h3>
        <p>
          Use at least 10 characters, mixing uppercase letters, numbers, and symbols. Avoid dictionary words or personal details (birthdays, names). If you're sharing the PDF professionally, use a password manager to generate and store a strong unique password.
        </p>
        <h3>Related tools</h3>
        <p>
          You can also <Link href="/unlock">remove a password from a PDF</Link> you own, <Link href="/watermark">add a watermark</Link> for visual protection, or <Link href="/compress">reduce file size</Link> before sharing.
        </p>
      </div>
    </ToolPageLayout>
  );
}
