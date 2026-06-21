import AdSlot from '@/components/ui/AdSlot';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — PdfOnlineStudio PDF Tools',
  description: 'Read the PdfOnlineStudio Terms of Service before using our PDF processing tools.',
};

const lastUpdated = 'March 1, 2025';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using PdfOnlineStudio ("the Service") at pdfonlinestudio.com, you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.

If you do not agree to any part of these Terms, you must not use the Service. We reserve the right to update these Terms at any time, and continued use of the Service after changes constitutes your acceptance.`,
  },
  {
    id: 'description',
    title: '2. Description of Service',
    content: `PdfOnlineStudio provides web-based PDF processing tools including, but not limited to:

• Merging multiple PDF documents into one
• Splitting PDF documents into separate pages or ranges
• Compressing PDF file sizes
• Converting PDF pages to JPG image format
• Converting JPG and other images to PDF format

These services are provided free of charge for personal and commercial use, subject to fair-use limitations described in these Terms. We reserve the right to introduce premium tiers, rate limits, or feature restrictions in the future, with reasonable notice.`,
  },
  {
    id: 'permitted-use',
    title: '3. Permitted Use',
    content: `You may use PdfOnlineStudio for lawful purposes only. You agree that you will:

• Only upload files that you own or have the explicit right to process.
• Use the Service in good faith and not attempt to disrupt or overload our infrastructure.
• Not use the Service for any illegal, harmful, or fraudulent purpose.
• Not use automated scripts, bots, or scrapers to make bulk requests without prior written permission.
• Not attempt to reverse-engineer, decompile, or extract the source code of the Service.
• Not use the Service to process files containing malware, viruses, or malicious code.`,
  },
  {
    id: 'prohibited',
    title: '4. Prohibited Content',
    content: `You must not upload or process content that:

• Infringes any intellectual property rights (copyright, trademark, patent, trade secret).
• Contains child sexual abuse material (CSAM) or exploitative imagery of minors.
• Constitutes harassment, hate speech, or incitement to violence.
• Contains personally identifiable information of third parties without their consent.
• Is subject to legal hold, confidentiality order, or regulatory restriction that prevents third-party processing.
• You do not have the lawful right to process.

We reserve the right to report suspected illegal content to relevant authorities.`,
  },
  {
    id: 'ip',
    title: '5. Intellectual Property',
    content: `Your Content: You retain all intellectual property rights to the files you upload. By uploading a file, you grant PdfOnlineStudio a limited, temporary, non-exclusive licence solely to process the file for the purpose of providing the requested service. This licence terminates automatically upon deletion of the file (within 60 seconds of processing completion).

Our Content: The PdfOnlineStudio name, logo, website design, and underlying software are the intellectual property of PdfOnlineStudio Ltd. You may not copy, reproduce, or distribute them without written permission.

Open Source: Certain components of PdfOnlineStudio use open-source libraries (e.g., pdf-lib, sharp). Their respective licences apply.`,
  },
  {
    id: 'privacy',
    title: '6. Privacy',
    content: `Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms. By using the Service, you consent to the data practices described in the Privacy Policy.

In summary: files are processed and deleted immediately; we do not store or access your document contents.`,
  },
  {
    id: 'disclaimer',
    title: '7. Disclaimer of Warranties',
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

• Implied warranties of merchantability or fitness for a particular purpose.
• Warranties that the Service will be uninterrupted, error-free, or free of viruses.
• Warranties regarding the accuracy or reliability of any output produced by the Service.

You acknowledge that PDF processing may occasionally produce imperfect results, and you should always retain backups of original files. PdfOnlineStudio is not responsible for any data loss resulting from use of the Service.`,
  },
  {
    id: 'liability',
    title: '8. Limitation of Liability',
    content: `TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, FOLIOPRESS AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY:

• Indirect, incidental, special, or consequential damages.
• Loss of data, revenue, profits, or business opportunities.
• Damages arising from your use of or inability to use the Service.
• Damages arising from unauthorised access to or alteration of your files.

IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) USD $100.

Some jurisdictions do not allow exclusion of certain warranties or limitation of liability — in those jurisdictions, liability is limited to the maximum extent permitted by law.`,
  },
  {
    id: 'indemnification',
    title: '9. Indemnification',
    content: `You agree to indemnify, defend, and hold harmless PdfOnlineStudio and its affiliates from any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising from:

• Your use or misuse of the Service.
• Your violation of these Terms.
• Your violation of any third party's rights, including intellectual property rights.
• Any content you upload to the Service.`,
  },
  {
    id: 'termination',
    title: '10. Termination',
    content: `We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.

You may stop using the Service at any time. There is no account to close since no registration is required.`,
  },
  {
    id: 'governing',
    title: '11. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to conflict-of-law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.

If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
  {
    id: 'contact',
    title: '12. Contact',
    content: `For questions about these Terms, please contact us at:

Email: theory.civil@gmail.com
Address: PdfOnlineStudio Ltd., 123 Paper Lane, Digital City, 00000

We aim to respond to all legal enquiries within 10 business days.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen py-14 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono tracking-widest text-amber-600 uppercase mb-3">Legal</p>
          <h1 className="text-4xl font-display font-semibold text-ink-900 mb-3">Terms of Service</h1>
          <p className="text-sm text-ink-600 font-mono">Last updated: {lastUpdated}</p>
          <div className="mt-5 p-4 bg-ink-50 border border-ink-100 rounded-xl text-sm text-ink-600 leading-relaxed">
            Please read these Terms carefully before using PdfOnlineStudio. By using our service, you agree to be bound by these Terms.
          </div>
        </div>

        {/* Ad Top */}
        <AdSlot label="Top Banner — 728×90" height="90px" className="mb-10" />

        {/* Table of contents */}
        <div className="bg-ink-50 border border-ink-100 rounded-2xl p-6 mb-10">
          <h2 className="text-sm font-semibold text-ink-700 mb-3 uppercase tracking-wide font-mono">Contents</h2>
          <ol className="space-y-1.5 columns-2">
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
              {idx === 5 && (
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
