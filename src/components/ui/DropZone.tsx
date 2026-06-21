'use client';
import { useCallback, useRef, useState } from 'react';

interface DropZoneProps {
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  subLabel?: string;
  onFilesSelected: (files: File[]) => void;
}

export default function DropZone({
  accept,
  multiple = false,
  maxFiles = 10,
  label = 'Drop files here',
  subLabel,
  onFilesSelected,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).slice(0, maxFiles);
    onFilesSelected(files);
  }, [onFilesSelected, maxFiles]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => setIsDragOver(false);

  return (
    <div
      className={`drop-zone p-10 text-center cursor-pointer select-none ${isDragOver ? 'dragover' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label={`Upload files. ${label}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Icon */}
      <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-200 ${
        isDragOver ? 'bg-amber-100 text-amber-500 scale-110' : 'bg-ink-100 text-ink-600'
      }`}>
        {isDragOver ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        )}
      </div>

      <p className="text-ink-700 font-display font-semibold text-xl mb-1">
        {isDragOver ? 'Release to upload' : label}
      </p>
      {subLabel && (
        <p className="text-ink-600 text-sm">{subLabel}</p>
      )}

      <div className="mt-5 inline-flex items-center gap-2 bg-ink-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-ink-700 transition-colors duration-150">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
        Choose {multiple ? 'Files' : 'File'}
      </div>

      <p className="mt-3 text-xs text-ink-600 font-mono">
        {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ' · ')}
        {multiple && maxFiles > 1 ? ` · Max ${maxFiles} files` : ''}
      </p>
    </div>
  );
}
