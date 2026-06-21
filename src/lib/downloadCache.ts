/**
 * downloadCache — in-memory download cache using a window-level singleton.
 *
 * WHY window.__dlCache:
 *   Next.js App Router evaluates each 'use client' module independently,
 *   giving each page its own module scope. A module-level Map would be a
 *   different object in the tool page vs the download page — so lookups
 *   always return null. Attaching to `window` gives a true singleton shared
 *   across all modules in the same browser tab.
 *
 * WHY the cache entry is NOT deleted on first read / useEffect cleanup:
 *   React 18 StrictMode (active in Next.js dev) runs every useEffect twice:
 *   mount → cleanup → mount. If we release on cleanup, the entry is gone
 *   before the second mount reads it. The TTL auto-expires entries after
 *   5 minutes, which is sufficient cleanup.
 *
 * Security:
 *   The cache lives in the JS heap only — never serialised, never on disk,
 *   not visible in DevTools Application → Storage, cleared when the tab closes.
 */

interface CacheEntry {
  blobUrl: string;
  fileName: string;
  timer: ReturnType<typeof setTimeout>;
}

declare global {
  interface Window {
    __dlCache?: Map<string, CacheEntry>;
  }
}

const TTL_MS = 5 * 60 * 1_000; // 5 minutes

function getCache(): Map<string, CacheEntry> {
  if (typeof window === 'undefined') return new Map(); // SSR — never used
  if (!window.__dlCache) window.__dlCache = new Map();
  return window.__dlCache;
}

function _randomKey(): string {
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  return Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
}

function _expire(key: string): void {
  const cache = getCache();
  const entry = cache.get(key);
  if (!entry) return;
  clearTimeout(entry.timer);
  try { URL.revokeObjectURL(entry.blobUrl); } catch { /* already revoked */ }
  cache.delete(key);
}

/**
 * Store a processed Blob in the window-level cache.
 * Returns a short random key to pass in the /download URL.
 */
export function cacheDownload(blob: Blob, fileName: string): string {
  const key     = _randomKey();
  const blobUrl = URL.createObjectURL(blob);
  const timer   = setTimeout(() => _expire(key), TTL_MS);
  getCache().set(key, { blobUrl, fileName, timer });
  return key;
}

/**
 * Retrieve a cached entry.
 * Returns null if the key is unknown or expired.
 * Does NOT delete the entry — the download page may read it multiple
 * times (e.g. React StrictMode double-invoke, multiple downloads).
 */
export function retrieveDownload(key: string): { blobUrl: string; fileName: string } | null {
  if (!key) return null;
  const entry = getCache().get(key);
  if (!entry) return null;
  return { blobUrl: entry.blobUrl, fileName: entry.fileName };
}

/**
 * Explicitly release a cache entry (revoke blob URL + cancel TTL).
 * Safe to call multiple times. Does NOT cause issues if called after
 * the TTL has already expired.
 */
export function releaseDownload(key: string): void {
  _expire(key);
}
