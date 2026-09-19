export const SEO_LIMITS = {
  title: 60,
  description: 160,
} as const;

export const PUBLIC_SITE_URL = "https://sixbytes.in";

export function canonicalUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") return PUBLIC_SITE_URL;
  return `${PUBLIC_SITE_URL}${normalizedPath}`.replace(/([^:]\/)\/+/g, "$1");
}

function cleanWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function truncateAtWord(value: string, limit: number): string {
  if (value.length <= limit) return value;

  const truncated = value.slice(0, limit + 1).trim();
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > Math.floor(limit * 0.6) ? truncated.slice(0, lastSpace) : truncated.slice(0, limit)).trim();
}

export function normalizeSeoTitle(value: string): string {
  return truncateAtWord(cleanWhitespace(value), SEO_LIMITS.title);
}

export function normalizeMetaDescription(value: string): string {
  return truncateAtWord(cleanWhitespace(value), SEO_LIMITS.description);
}

export function isSafeResourceHtml(value: string): boolean {
  if (typeof value !== "string" || value.length > 200_000) return false;

  return !(
    /<\s*(script|style|iframe|object|embed|form|input|button|meta|link)\b/i.test(value) ||
    /\bon[a-z]+\s*=/i.test(value) ||
    /(?:javascript|vbscript|data)\s*:/i.test(value)
  );
}
