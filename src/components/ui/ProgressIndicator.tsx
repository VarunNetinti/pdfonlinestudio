'use client';

interface ProgressProps {
  progress: number; // 0–100
  label?: string;
  status?: 'idle' | 'processing' | 'success' | 'error';
}

export default function ProgressIndicator({ progress, label, status = 'processing' }: ProgressProps) {
  const colors = {
    idle: 'from-ink-300 to-ink-400',
    processing: 'from-amber-400 to-amber-500',
    success: 'from-green-400 to-emerald-500',
    error: 'from-red-400 to-rose-500',
  };

  const icons = {
    processing: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
    ),
    success: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    idle: null,
  };

  const textColors = {
    idle: 'text-ink-700',
    processing: 'text-amber-600',
    success: 'text-green-600',
    error: 'text-red-600',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-sm font-medium ${textColors[status]}`}>
          {icons[status]}
          <span>{label || (status === 'processing' ? 'Processing...' : status === 'success' ? 'Done!' : status === 'error' ? 'Error' : '')}</span>
        </div>
        <span className="text-xs font-mono text-ink-600">{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill bg-gradient-to-r ${colors[status]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
