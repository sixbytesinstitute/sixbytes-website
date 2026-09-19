export const SEO_HEALTH_PATHS = [
  "/",
  "/about",
  "/courses",
  "/results",
  "/resources",
  "/contact",
] as const;

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function parseSitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((match) => decodeXml(match[1]));
}

export function isSuccessfulHttpStatus(status: number): boolean {
  return status >= 200 && status < 400;
}
