import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-display font-bold text-ink-100 mb-4">404</p>
        <h1 className="text-2xl font-display font-semibold text-ink-900 mb-3">Page not found</h1>
        <p className="text-ink-700 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-accent">
          Back to home
        </Link>
      </div>
    </div>
  );
}
