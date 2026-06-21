import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ui/ArticleLayout';

export const metadata: Metadata = {
  title: 'PDF Security Guide: Passwords, Encryption & Permissions',
  description: 'How PDF encryption works, the difference between user and owner passwords, AES-256 vs RC4, and when to use each security level.',
  alternates: { canonical: 'https://pdfonlinestudio.com/blog/pdf-security-guide' },
};

export default function Article() {
  return (
    <ArticleLayout
      title="PDF Security Guide: Passwords, Encryption & Permissions"
      description="How PDF encryption works, the difference between user and owner passwords, and when to use different security levels."
      category="Guide"
      readTime="9 min"
      slug="pdf-security-guide"
      relatedTools={[
        { href: '/protect', label: 'Protect PDF' },
        { href: '/unlock', label: 'Unlock PDF' },
      ]}
    >
      <h2>How PDF security works</h2>
      <p>
        PDF security has two main mechanisms: <strong>encryption</strong> (protecting the file so it can't be opened without a password) and <strong>permissions</strong> (controlling what an authorised user can do with the file — whether they can print, copy text, or modify it).
      </p>
      <p>
        These two mechanisms are controlled by two separate passwords, which is a source of confusion for many users.
      </p>

      <h2>User password vs owner password</h2>

      <h3>User password (open password)</h3>
      <p>
        The user password is required to <em>open</em> the document. Without it, the file cannot be read at all. This is the password you set when you want to restrict who can access a document. Anyone who wants to view the PDF must enter this password.
      </p>

      <h3>Owner password (permissions password)</h3>
      <p>
        The owner password controls permissions — printing, copying text, modifying the document, filling forms, etc. When you set an owner password, users can open the document (without a password if no user password is set), but their actions are restricted according to the permissions you configured.
      </p>
      <p>
        If no user password is set but an owner password is, anyone can open the document but cannot (without the owner password) change its permissions or perform restricted actions.
      </p>

      <h3>Setting both passwords</h3>
      <p>
        You can set both: a user password (required to open the file) and an owner password (required to change permissions or perform restricted actions). The owner password must be different from the user password.
      </p>

      <h2>Encryption algorithms: AES vs RC4</h2>
      <p>
        PDF supports several encryption algorithms. The standard has evolved over PDF versions:
      </p>
      <ul>
        <li><strong>RC4 40-bit</strong> (PDF 1.1–1.3) — obsolete, trivially crackable in minutes. Never use.</li>
        <li><strong>RC4 128-bit</strong> (PDF 1.4) — outdated, crackable with modern hardware. Avoid.</li>
        <li><strong>AES 128-bit</strong> (PDF 1.5–1.6) — acceptable but superseded. Used by older tools.</li>
        <li><strong>AES 256-bit</strong> (PDF 1.7 / PDF 2.0) — current standard. Used by Adobe Acrobat Pro and modern tools. This is what PdfOnlineStudio uses.</li>
      </ul>
      <p>
        AES-256 is the same encryption standard used by governments and financial institutions. A well-chosen password combined with AES-256 is effectively unbreakable with current technology.
      </p>

      <h2>PDF permissions explained</h2>
      <p>
        When setting an owner password, you can configure these permissions:
      </p>
      <ul>
        <li><strong>Printing</strong> — allow/disallow printing. Can be further limited to "low resolution printing only".</li>
        <li><strong>Copying text and images</strong> — prevents selecting and copying content from the document.</li>
        <li><strong>Modifying the document</strong> — prevents adding/removing pages, modifying form fields, etc.</li>
        <li><strong>Filling forms</strong> — allows filling PDF form fields even when other modification is disabled.</li>
        <li><strong>Annotations and comments</strong> — allows adding/editing sticky notes and highlights.</li>
        <li><strong>Accessibility content</strong> — should generally be left enabled for screen reader support.</li>
        <li><strong>Document assembly</strong> — prevents inserting, deleting, or rotating pages.</li>
      </ul>

      <h2>Limitations of PDF permissions</h2>
      <p>
        PDF permissions are only enforced by PDF viewers that respect them — specifically, Adobe Acrobat and most commercial PDF viewers. However:
      </p>
      <ul>
        <li>Permissions can be bypassed by tools that don't enforce them (many open-source PDF libraries don't check permissions)</li>
        <li>Anyone with the owner password can remove all restrictions</li>
        <li>A user can still take screenshots of restricted content</li>
      </ul>
      <p>
        <strong>Think of PDF permissions as a deterrent, not a technical barrier.</strong> For genuinely sensitive content, use strong encryption (user password + AES-256) rather than relying on permissions alone.
      </p>

      <h2>Password strength matters enormously</h2>
      <p>
        AES-256 encryption is only as strong as the password protecting it. Weak passwords can be cracked by dictionary attacks:
      </p>
      <ul>
        <li>A common word like "password123" can be cracked in seconds</li>
        <li>A 6-character random alphanumeric password: crackable in hours with a powerful GPU</li>
        <li>A 12-character random password with symbols: effectively uncrackable</li>
        <li>A passphrase of 4+ random words (e.g., "correct horse battery staple"): extremely strong and memorable</li>
      </ul>

      <h2>How to password-protect a PDF</h2>
      <p>
        The quickest free method: upload to <Link href="/protect">PdfOnlineStudio Protect PDF</Link>, enter your password, and download the encrypted file. No account needed.
      </p>
      <p>
        For bulk protection or more control, Adobe Acrobat Pro (File → Properties → Security) or command-line tools like qpdf:
      </p>
      <pre><code>qpdf --encrypt user-password owner-password 256 -- input.pdf output.pdf</code></pre>

      <h2>How to remove a PDF password</h2>
      <p>
        If you know the password and want to remove it: use <Link href="/unlock">PdfOnlineStudio Unlock PDF</Link>. Enter the correct password, and the decrypted PDF downloads without any password protection.
      </p>
      <p>
        Note: if you've forgotten the password to your own document, there is no simple free solution. Password recovery tools exist for PDF but are expensive and slow (brute-force attacks).
      </p>

      <h2>Digital signatures: a separate security layer</h2>
      <p>
        PDF digital signatures (distinct from drawn signatures) cryptographically verify that a document hasn't been modified since it was signed and confirm the identity of the signer. They require a digital certificate and are typically used for legal and contractual documents.
      </p>
      <p>
        Merging or modifying a digitally signed PDF invalidates the signature — which is intentional. If you merge or compress a signed PDF, the signature is broken and the recipient cannot verify integrity.
      </p>

      <h2>Practical security recommendations</h2>
      <ul>
        <li>For documents you're sending to specific people: use a strong user password (12+ characters) with AES-256</li>
        <li>For internal documents you want to restrict modification but not viewing: use only an owner password with modification restrictions</li>
        <li>For truly sensitive documents: encrypt + use a separate secure channel to share the password</li>
        <li>Add a <Link href="/watermark">watermark</Link> as an additional visual deterrent against unauthorised redistribution</li>
        <li>Never send password and document in the same email — use a phone call, text, or separate message to share the password</li>
      </ul>
    </ArticleLayout>
  );
}
