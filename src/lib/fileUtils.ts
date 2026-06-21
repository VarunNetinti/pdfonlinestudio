import { IncomingMessage } from 'http';
import formidable, { Fields, Files } from 'formidable';
import { tmpdir } from 'os';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

/** Temp working directory for this process */
const TMP_DIR = path.join(tmpdir(), 'pdftools');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

/**
 * Parse a multipart/form-data request using formidable.
 * Returns { fields, files } and a cleanup() function to delete temp files.
 */
export async function parseForm(
  req: IncomingMessage,
  maxFileSizeMB = 100
): Promise<{ fields: Fields; files: Files; cleanup: () => void }> {
  const uploadDir = path.join(TMP_DIR, uuidv4());
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: maxFileSizeMB * 1024 * 1024,
    maxTotalFileSize: maxFileSizeMB * 10 * 1024 * 1024,
    multiples: true,
  });

  const [fields, files] = await form.parse(req);

  const cleanup = () => {
    try {
      fs.rmSync(uploadDir, { recursive: true, force: true });
    } catch {
      // Best-effort cleanup — no-op on failure
    }
  };

  return { fields, files, cleanup };
}

/** Write a buffer to a temp file and return its path */
export function writeTempFile(buffer: Buffer, ext: string): string {
  const filePath = path.join(TMP_DIR, `${uuidv4()}${ext}`);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

/** Delete a file, no-op on failure */
export function deleteTempFile(filePath: string) {
  try {
    fs.unlinkSync(filePath);
  } catch {
    // no-op
  }
}

/** Read a file into a Buffer */
export function readFile(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}

/** Parse a page-range string like "1-3,5,7-9" into 0-indexed page numbers */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= Math.min(end, totalPages); i++) {
          if (i >= 1) pages.add(i - 1); // convert to 0-indexed
        }
      }
    } else {
      const n = Number(part);
      if (!isNaN(n) && n >= 1 && n <= totalPages) pages.add(n - 1);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
