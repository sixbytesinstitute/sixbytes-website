import assert from "node:assert/strict";
import test from "node:test";
import {
  SEO_LIMITS,
  normalizeMetaDescription,
  normalizeSeoTitle,
  isSafeResourceHtml,
  canonicalUrl,
} from "../lib/seo-policy.ts";
import { canManagePublicResources, getDashboardPath } from "../lib/permissions.ts";

test("manager can manage public resources but cannot use admin-only permissions", () => {
  assert.equal(canManagePublicResources("manager"), true);
  assert.equal(canManagePublicResources("admin"), true);
  assert.equal(canManagePublicResources("faculty"), false);
  assert.equal(canManagePublicResources("student"), false);
  assert.equal(getDashboardPath("manager"), "/manager/resources");
});

test("SEO title and description are bounded at audit-safe lengths", () => {
  const longTitle = "A very long educational resource title ".repeat(4);
  const longDescription = "A detailed description for a published resource. ".repeat(6);

  assert.equal(normalizeSeoTitle(longTitle).length <= SEO_LIMITS.title, true);
  assert.equal(normalizeMetaDescription(longDescription).length <= SEO_LIMITS.description, true);
  assert.equal(normalizeSeoTitle("  Short title  "), "Short title");
  assert.equal(normalizeMetaDescription("  Short description  "), "Short description");
});

test("resource content rejects executable HTML while allowing the established format", () => {
  assert.equal(isSafeResourceHtml("<h2>Concepts</h2><p>Notes</p><ul><li>Point</li></ul>"), true);
  assert.equal(isSafeResourceHtml('<script>alert("x")</script>'), false);
  assert.equal(isSafeResourceHtml('<p onclick="alert(1)">Unsafe</p>'), false);
  assert.equal(isSafeResourceHtml('<a href="javascript:alert(1)">Unsafe</a>'), false);
});

test("canonical URLs always use the production HTTPS origin", () => {
  assert.equal(canonicalUrl("/"), "https://sixbytes.in");
  assert.equal(canonicalUrl("/resources/example"), "https://sixbytes.in/resources/example");
  assert.equal(canonicalUrl("resources/example"), "https://sixbytes.in/resources/example");
});
