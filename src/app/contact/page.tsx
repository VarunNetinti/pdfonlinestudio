'use client';
import { useState } from 'react';

type FormState = 'idle' | 'sending' | 'sent' | 'error';

const topics = [
  'General enquiry',
  'Bug report',
  'Feature request',
  'Business / partnership',
  'Privacy or legal',
  'Other',
];

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg]   = useState('');
  const [formData, setFormData]   = useState({
    name: '', email: '', topic: '', message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setFormState('sent');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setFormState('error');
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', topic: '', message: '' });
    setFormState('idle');
    setErrorMsg('');
  };

  const inputClass =
    'w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-ink-800 text-sm focus:outline-none focus:border-amber-400 transition-colors bg-white placeholder:text-ink-300';

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="container mx-auto max-w-4xl relative text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <span className="text-xs font-mono text-amber-700 tracking-wide">We're here to help</span>
          </div>
          <h1 className="text-5xl font-display font-semibold text-ink-900 mb-4">Get in touch</h1>
          <p className="text-ink-700 max-w-lg mx-auto">
            Found a bug, have a feature idea, or just want to say hi? We read every message and reply personally.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink-900 mb-1">Contact info</h2>
              <p className="text-sm text-ink-600">We typically reply within 24–48 hours.</p>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0 border border-amber-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-mono text-ink-500 uppercase tracking-wide mb-0.5">Email</p>
                <a href="mailto:theory.civil@gmail.com"
                  className="text-sm font-medium text-ink-800 hover:text-amber-600 transition-colors">
                  theory.civil@gmail.com
                </a>
              </div>
            </div>

            {/* Response time */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0 border border-green-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-mono text-ink-500 uppercase tracking-wide mb-0.5">Response time</p>
                <p className="text-sm font-medium text-ink-800">Within 24–48 hours</p>
              </div>
            </div>

            {/* FAQ nudge */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-semibold text-amber-800 mb-1">💡 Quick answers</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Check our <a href="#faq" className="underline underline-offset-2 font-medium">FAQ below</a> — common questions are answered there instantly.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {formState === 'sent' ? (
              <div className="bg-white border border-ink-100 rounded-3xl p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-semibold text-ink-900 mb-2">Message sent!</h3>
                <p className="text-ink-600 mb-2">
                  Thanks <strong>{formData.name}</strong> — your message is on its way.
                </p>
                <p className="text-sm text-ink-500 mb-7">
                  We'll reply to <strong>{formData.email}</strong> within 24–48 hours. Check your inbox (and spam folder just in case).
                </p>
                <button onClick={handleReset} className="btn-outline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-ink-100 rounded-3xl p-8 shadow-sm space-y-5">
                <div>
                  <h2 className="text-xl font-display font-semibold text-ink-900 mb-0.5">Send us a message</h2>
                  <p className="text-sm text-ink-500">All fields marked * are required.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-1.5">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      required placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-1.5">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      required placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-1.5">Topic</label>
                  <select name="topic" value={formData.topic} onChange={handleChange} className={inputClass}>
                    <option value="">Select a topic…</option>
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-1.5">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange}
                    required rows={5} placeholder="Tell us what's on your mind…"
                    className={`${inputClass} resize-none`} />
                </div>

                {formState === 'error' && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {errorMsg || 'Something went wrong. Please try again or email us directly.'}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                  <button type="submit" disabled={formState === 'sending'} className="btn-primary disabled:opacity-50">
                    {formState === 'sending' ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                          <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Send message
                      </>
                    )}
                  </button>
                  <p className="text-xs text-ink-500">We respond within 24–48 hours</p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <section id="faq" className="mt-20">
          <div className="text-center mb-10">
            <p className="text-xs font-mono tracking-widest text-amber-600 uppercase mb-3">FAQ</p>
            <h2 className="text-3xl font-display font-semibold text-ink-900">Frequently asked questions</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { q:'Are my files safe?',            a:'Yes. All files are processed in isolated environments and permanently deleted within 60 seconds of your download completing. We never read, store, or share your documents.' },
              { q:'Is PdfOnlineStudio free?',       a:'Yes, all 27 tools are completely free. No account, no hidden fees, no watermarks.' },
              { q:'What is the file size limit?',   a:'Up to 100 MB per file. For merge operations you can upload up to 20 PDFs at once.' },
              { q:'Do you support encrypted PDFs?', a:'Yes for most standard-encrypted PDFs. Password-protected files can be processed with the Unlock PDF tool.' },
              { q:'Can I use it on mobile?',        a:'Absolutely. The interface is fully responsive — works perfectly on phones, tablets, and desktops.' },
              { q:'How do I report a bug?',         a:'Use the form above and select "Bug report". Include the tool name, what you tried, and what happened.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display font-semibold text-ink-900 text-base mb-2">{q}</h3>
                <p className="text-sm text-ink-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
