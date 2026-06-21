export default function Loading() {
  return (
    <div className="min-h-screen py-10 px-4 animate-pulse">
      <div className="container mx-auto max-w-3xl">
        <div className="h-4 bg-ink-100 rounded w-32 mb-8" />
        <div className="h-24 bg-ink-100 rounded-xl mb-8" />
        <div className="bg-white border border-ink-100 rounded-3xl p-8">
          <div className="h-48 bg-ink-50 rounded-2xl mb-6" />
          <div className="h-10 bg-ink-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
