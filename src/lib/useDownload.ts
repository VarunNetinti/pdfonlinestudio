'use client';
import { useRouter } from 'next/navigation';

/**
 * useDownload — shared hook for all tool pages.
 * After a successful API response, redirects to /download with:
 *   - blob URL stored accessible via the URL param
 *   - file name, tool name, optional savings %
 */
export function useDownload() {
  const router = useRouter();

  const redirectToDownload = (blob: Blob, fileName: string, tool: string, savedPct?: number) => {
    const url = URL.createObjectURL(blob);
    const params = new URLSearchParams({
      file: fileName,
      tool,
      url,
    });
    if (savedPct !== undefined && savedPct > 0) {
      params.set('saved', String(savedPct));
    }
    router.push(`/download?${params.toString()}`);
  };

  return { redirectToDownload };
}
