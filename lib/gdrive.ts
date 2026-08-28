/**
 * Google Drive URL utilities.
 *
 * Extracts file IDs from various Google Drive URL formats and
 * generates embed/download URLs for in-site viewing.
 *
 * Supported URL formats:
 * - https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
 * - https://drive.google.com/file/d/{FILE_ID}/edit
 * - https://drive.google.com/open?id={FILE_ID}
 * - https://drive.google.com/uc?id={FILE_ID}&export=download
 * - https://docs.google.com/document/d/{FILE_ID}/edit
 * - https://docs.google.com/spreadsheets/d/{FILE_ID}/edit
 * - https://docs.google.com/presentation/d/{FILE_ID}/edit
 */

// ─── Regex patterns for file ID extraction ──────────────
const DRIVE_PATTERNS = [
  // /file/d/{ID}/ or /document/d/{ID}/ etc.
  /\/d\/([a-zA-Z0-9_-]{10,})/,
  // ?id={ID} or &id={ID}
  /[?&]id=([a-zA-Z0-9_-]{10,})/,
];

/**
 * Extract the Google Drive file ID from any Drive URL.
 * Returns null if the URL is not a valid Google Drive link.
 */
export function extractDriveFileId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  for (const pattern of DRIVE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get the embeddable preview URL for a Google Drive file.
 * This renders the file in an iframe for in-site viewing.
 */
export function getDriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Get the direct download URL for a Google Drive file.
 */
export function getDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Validate that a URL is a valid Google Drive link.
 * Returns the file ID if valid, null otherwise.
 */
export function validateDriveUrl(url: string): {
  valid: boolean;
  fileId: string | null;
  embedUrl: string | null;
  downloadUrl: string | null;
} {
  const fileId = extractDriveFileId(url);

  if (!fileId) {
    return { valid: false, fileId: null, embedUrl: null, downloadUrl: null };
  }

  return {
    valid: true,
    fileId,
    embedUrl: getDriveEmbedUrl(fileId),
    downloadUrl: getDriveDownloadUrl(fileId),
  };
}
