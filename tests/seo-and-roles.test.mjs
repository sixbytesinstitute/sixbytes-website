import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  SEO_LIMITS,
  normalizeMetaDescription,
  normalizeSeoTitle,
  isSafeResourceHtml,
  canonicalUrl,
} from "../lib/seo-policy.ts";
import { canManagePublicResources, getDashboardPath } from "../lib/permissions.ts";
import * as analytics from "../lib/analytics.ts";
import { isCronAuthorized } from "../lib/cron-auth.ts";
import { parseSitemapUrls } from "../lib/seo-maintenance.ts";

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

test("scheduled jobs do not fabricate traffic or mutate resource views", () => {
  const searchCron = readFileSync("app/api/cron/local-search-pinger/route.ts", "utf8");
  const readerCron = readFileSync("app/api/cron/resource-reader/route.ts", "utf8");

  assert.doesNotMatch(searchCron, /simulatedIp|pingsExecuted|google\.com\/search/);
  assert.doesNotMatch(readerCron, /simulatedReferrer|\$inc:\s*\{\s*viewCount/);
});

test("SEO maintenance is a protected read-only cron route", () => {
  const routePath = "app/api/cron/seo-maintenance/route.ts";
  assert.equal(existsSync(routePath), true);
  const route = readFileSync(routePath, "utf8");
  assert.match(route, /CRON_SECRET/);
  assert.match(route, /isCronAuthorized/);
  assert.doesNotMatch(route, /\$inc:\s*\{\s*viewCount/);
});

test("cron authorization requires the exact bearer secret", () => {
  assert.equal(isCronAuthorized("Bearer test-secret", "test-secret"), true);
  assert.equal(isCronAuthorized("Bearer wrong-secret", "test-secret"), false);
  assert.equal(isCronAuthorized(null, "test-secret"), false);
  assert.equal(isCronAuthorized("Bearer test-secret", undefined), false);
});

test("sitemap parser extracts and decodes canonical URLs", () => {
  assert.deepEqual(
    parseSitemapUrls(
      "<urlset><url><loc>https://sixbytes.in/resources/a&amp;b</loc></url><url><loc>https://sixbytes.in/</loc></url></urlset>",
    ),
    ["https://sixbytes.in/resources/a&b", "https://sixbytes.in/"],
  );
});

test("resource search tracking exposes a real analytics event helper", () => {
  assert.equal(typeof analytics.buildResourceSearchEvent, "function");
  assert.deepEqual(
    analytics.buildResourceSearchEvent("  quadratic equations  ", {
      subject: "Mathematics",
      targetClass: "10",
      board: "CBSE",
      resourceType: "question_bank",
    }),
    {
      event_category: "Engagement",
      search_query: "quadratic equations",
      subject: "Mathematics",
      target_class: "10",
      board: "CBSE",
      resource_type: "question_bank",
    },
  );
});
