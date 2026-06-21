'use client';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onReorder?: (from: number, to: number) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="15" y2="17"/>
        <polyline points="9 9 10 9"/>
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

export default function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-ink-600 mb-3">
        {files.length} file{files.length > 1 ? 's' : ''} selected
      </p>
      {files.map((file, idx) => (
        <div
          key={`${file.name}-${idx}`}
          className="flex items-center gap-3 p-3.5 bg-white border border-ink-100 rounded-xl hover:border-ink-200 transition-colors group"
        >
          {/* File type icon */}
          <div className="w-9 h-9 rounded-lg bg-ink-50 flex items-center justify-center text-ink-600 flex-shrink-0">
            {getFileIcon(file.name)}
          </div>

          {/* Name and size */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-800 truncate">{file.name}</p>
            <p className="text-xs text-ink-600 mt-0.5 font-mono">{formatFileSize(file.size)}</p>
          </div>

          {/* Index badge */}
          <span className="text-xs font-mono text-ink-300 hidden sm:block">#{idx + 1}</span>

          {/* Remove button */}
          <button
            onClick={() => onRemove(idx)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150 opacity-0 group-hover:opacity-100 flex-shrink-0"
            aria-label={`Remove ${file.name}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
