import AdSlot from '@/components/ui/AdSlot';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PdfOnlineStudio PDF Tools',
  description: 'Read how PdfOnlineStudio handles your data and protects your privacy.',
};

const lastUpdated = 'March 1, 2025';

const sections = [
  {
    id: 'overview',
    title: '1. Overview',
    content: `PdfOnlineStudio ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have in relation to your personal data when you use our website and PDF processing services at pdfonlinestudio.com.

By using PdfOnlineStudio, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our services.`,
  },
  {
    id: 'files',
    title: '2. Files You Upload',
    content: `Files uploaded to PdfOnlineStudio are processed entirely for the purpose of performing the requested operation (merge, split, compress, convert). Specifically:

• Files are uploaded over an encrypted HTTPS connection.
• Files are processed in isolated, temporary server environments.
• Files are permanently and automatically deleted from our servers immediately after the processed output is generated and made available for download — typically within 60 seconds.
• We do not read, analyse, index, copy, or share your file contents for any purpose.
• We do not use your files to train machine learning models.
• We do not retain any copies of your files after processing is complete.

You are solely responsible for ensuring you have the rights to upload and process any documents you submit to PdfOnlineStudio.`,
  },
  {
    id: 'personal-data',
    title: '3. Personal Data We Collect',
    content: `PdfOnlineStudio does not require you to create an account or provide personal information to use our tools. However, we may collect limited technical information automatically:

Usage & Analytics Data
• Pages visited, buttons clicked, and features used (via privacy-preserving analytics).
• Browser type, operating system, and general device category.
• Country-level location (derived from IP address — we do not store full IP addresses).
• Referring website or search query that brought you to PdfOnlineStudio.

This data is collected in aggregate and cannot be used to identify you individually. We use this information solely to understand how the service is used and to improve it.

Log Data
Our servers may temporarily log HTTP request metadata (method, path, timestamp, response status) for security monitoring and debugging. These logs are purged on a rolling 7-day basis and do not contain file contents.`,
  },
  {
    id: 'cookies',
    title: '4. Cookies & Tracking',
    content: `PdfOnlineStudio uses only essential and analytics cookies:

Essential cookies: Required for the service to function correctly (e.g., session continuity). These cannot be disabled.

Analytics cookies: Used to measure traffic and feature usage. These are privacy-preserving and do not track you across other websites. You can opt out by enabling "Do Not Track" in your browser or using a browser extension.

We do not use advertising trackers, fingerprinting, or any third-party tracking pixels beyond those described above.

If Google AdSense is enabled on the site, Google may set its own cookies per Google's Privacy Policy. You can manage Google ad preferences at adssettings.google.com.`,
  },
  {
    id: 'third-parties',
    title: '5. Third-Party Services',
    content: `We use the following third-party services to operate PdfOnlineStudio:

• Cloud infrastructure (hosting & compute): Files are processed on servers operated by our infrastructure provider. These providers are contractually bound to process data only as instructed and maintain appropriate security measures.
• Analytics: We use a privacy-preserving analytics tool that does not sell or share data.
• Content delivery (CDN): Static assets are served via a CDN for performance. CDN providers do not have access to your uploaded files.

We do not sell, rent, or trade your personal data to any third party for marketing purposes.`,
  },
  {
    id: 'security',
    title: '6. Data Security',
    content: `We implement industry-standard security measures to protect your data:

• All data in transit is encrypted using TLS 1.2 or higher.
• File processing occurs in ephemeral, isolated containers.
• Access to server infrastructure is restricted to authorised personnel only.
• We conduct regular security reviews.

However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.`,
  },
  {
    id: 'rights',
    title: '7. Your Rights (GDPR / CCPA)',
    content: `Depending on your location, you may have certain rights regarding personal data:

• Right to access: Request a copy of any personal data we hold about you.
• Right to erasure: Request deletion of your personal data.
• Right to object: Object to certain types of data processing.
• Right to portability: Receive your data in a portable format.
• Right to withdraw consent: Where processing is based on consent, withdraw it at any time.

Since PdfOnlineStudio does not store uploaded files or require account creation, there is typically no personal data linked to your usage. To exercise any of the above rights, or if you believe we hold personal information about you, contact us at theory.civil@gmail.com.

California residents (CCPA): We do not sell personal information as defined by the CCPA.`,
  },
  {
    id: 'children',
    title: '8. Children\'s Privacy',
    content: `PdfOnlineStudio is not directed at children under the age of 13 (or 16 in certain jurisdictions). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.`,
  },
  {
    id: 'changes',
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date at the top of this page. For significant changes, we will post a notice on our homepage for 30 days. Your continued use of PdfOnlineStudio after changes are posted constitutes your acceptance of the updated policy.`,
  },
  {
    id: 'contact',
    title: '10. Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:

Email: theory.civil@gmail.com
Mailing address: PdfOnlineStudio Ltd., 123 Paper Lane, Digital City, 00000

We aim to respond to all privacy-related enquiries within 5 business days.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-14 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono tracking-widest text-amber-600 uppercase mb-3">Legal</p>
          <h1 className="text-4xl font-display font-semibold text-ink-900 mb-3">Privacy Policy</h1>
          <p className="text-sm text-ink-600 font-mono">Last updated: {lastUpdated}</p>
          <div className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 leading-relaxed">
            <strong className="font-semibold">TL;DR:</strong> We don't store your files. Files are deleted immediately after processing. We don't require an account and collect minimal anonymous usage data only.
          </div>
        </div>

        {/* Ad Top */}
        <AdSlot label="Top Banner — 728×90" height="90px" className="mb-10" />

        {/* Table of contents */}
        <div className="bg-ink-50 border border-ink-100 rounded-2xl p-6 mb-10">
          <h2 className="text-sm font-semibold text-ink-700 mb-3 uppercase tracking-wide font-mono">Contents</h2>
          <ol className="space-y-1.5">
            {sections.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-ink-600 hover:text-amber-700 transition-colors">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-display font-semibold text-ink-900 mb-4 pb-3 border-b border-ink-100">
                {section.title}
              </h2>
              <div className="text-ink-600 text-sm leading-loose whitespace-pre-line">
                {section.content}
              </div>
              {/* Insert mid ad after section 5 */}
              {idx === 4 && (
                <div className="mt-10">
                  <AdSlot label="Middle Content — 970×250" height="120px" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Ad */}
        <div className="mt-14">
          <AdSlot label="Bottom Banner — 728×90" height="90px" />
        </div>

      </div>
    </div>
  );
}
