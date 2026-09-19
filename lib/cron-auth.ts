import { timingSafeEqual } from "node:crypto";

export function isCronAuthorized(
  authorizationHeader: string | null,
  expectedSecret = process.env.CRON_SECRET,
): boolean {
  if (!authorizationHeader || !expectedSecret) return false;

  const expected = Buffer.from(`Bearer ${expectedSecret}`);
  const actual = Buffer.from(authorizationHeader);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
