/**
 * Sanitization Utilities
 * Shared helpers to prevent injection attacks across the codebase.
 */

/**
 * Escapes special regex characters in a string so it can be safely used
 * in a MongoDB $regex query without risk of ReDoS.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Safely serializes a JSON-LD object for inline <script> tags.
 * Escapes `<` as `\u003c` to prevent `</script>` injection.
 */
export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
