# Manager Publishing and SEO Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development or executing-plans to implement this plan task-by-task.

## Goal

Provision a manager-level content workflow using the existing resource model and editor, then remove the application-level causes of the supplied SEO audit findings without changing the public resource visual format.

## Scope

### Manager publishing

- Add `manager` as a persisted/authenticated role below `admin`.
- Give managers access only to the existing public-resource editor and account security page.
- Keep user management, dashboard administration, and other admin-only operations restricted to `admin`.
- Reuse the existing resource schema, HTML content format, IndexNow publishing hook, and public resource renderer.

### SEO and crawlability

- Enforce search title and meta-description length at the schema/API/UI boundaries.
- Normalize page titles so the root title template cannot create oversized titles.
- Complete Open Graph metadata for public marketing/resource pages.
- Remove the duplicate homepage H1.
- Server-render the public resource index so crawlers receive real internal links without client-side JavaScript.
- Cache/revalidate public resource reads and share the resource query between metadata and page rendering.
- Make sitemap and canonical URLs use the HTTPS production origin and contain only published resource URLs.
- Add a repeatable local metadata/link audit script.

## Files

- `lib/constants.ts`, `lib/auth.ts`, `proxy.ts`: role and route protection.
- `models/User.ts`, `lib/seed-admins.ts`: persisted role validation.
- `app/admin/users/page.tsx`, `app/admin/dashboard/page.tsx`: admin onboarding and visibility.
- `app/components/dashboard-sidebar.tsx`, `app/components/site-layout.tsx`: manager navigation/layout.
- `app/manager/layout.tsx`, `app/manager/page.tsx`, `app/manager/resources/page.tsx`: manager portal.
- `app/api/admin/resources/route.ts`, `app/api/admin/resources/[id]/route.ts`: manager authorization and input validation.
- `models/Resource.ts`, `lib/seo.ts`: metadata policy and canonical origin.
- `app/page.tsx`, `app/about/page.tsx`, `app/courses/page.tsx`, `app/results/page.tsx`, `app/contact/page.tsx`, `app/resources/layout.tsx`: metadata cleanup.
- `app/resources/page.tsx`, `app/resources/resources-client.tsx`: server-rendered resource links and interactive filters.
- `app/resources/[slug]/page.tsx`, `app/api/resources/route.ts`: cached public resource reads.
- `app/sitemap.ts`, `app/robots.ts`, `next.config.ts`: crawl and redirect behavior.
- `scripts/audit-seo.mjs`: local regression audit.
- `tests/seo-and-roles.test.mjs`: focused regression tests.

## Test sequence

1. Add focused failing tests for manager permissions and SEO normalization.
2. Run the focused tests and confirm they fail for the intended reasons.
3. Implement the minimal role and metadata changes.
4. Run the focused tests again, then lint and build.
5. Start the production app and check metadata, H1 counts, canonical URLs, sitemap entries, and server-rendered resource links at desktop/mobile widths.
6. Report deployment-only redirect items separately if they cannot be proven from the local app.
